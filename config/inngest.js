import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Ingest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// Ingest function to update user data in db
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
// Inngest function to create user's order in database
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order", // 🆔 Ye function ka unique naam hai (Inngest ke andar identify karne ke liye)
    batchEvents: {
      maxSize: 25,           // 📦 Ek batch me max 25 orders process honge
      timeout: "5s",         // ⏱️ 5 seconds ke andar batch execute kar do
    },
  },
  { event: "order/created" }, // 📢 Jab bhi "order/created" event trigger hoga, ye function chalega
  async ({ events }) => {     // 🔄 Inngest se aane wale multiple events (orders) yahan receive honge

    // 🧾 Har event se order ka data nikal rahe hain aur ek array bana rahe hain
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,   // 👤 Order kis user ne place kiya
        items: event.data.items,     // 🛒 User ke selected products
        amount: event.data.amount,   // 💰 Total order amount
        address: event.data.address, // 📍 Delivery address
        date: event.data.date,       // 🕒 Order banne ki date
      };
    });

    // 🔗 Database se connection establish kar rahe hain
    await connectDB();

    // 💾 Sare orders ek saath database me insert kar rahe hain (performance ke liye efficient)
    await Order.insertMany(orders);

    // ✅ Return kar rahe hain kitne orders process hue aur success status
    return { success: true, processed: orders.length };
  }
);
