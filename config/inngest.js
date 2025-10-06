import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Ingest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async (event) => {
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
    event: "clerk/user.created",
  },
  async (event) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(userData);
  }
);

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
