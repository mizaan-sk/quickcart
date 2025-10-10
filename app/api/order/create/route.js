import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();
    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid Data" });
    }
    // calculate amount using items
    // 🧮 Total amount calculate karne ke liye reduce use kar rahe hain
    const amount = await items.reduce(async (acc, item) => {
      // 🔍 Database se product ka data nikal rahe hain (price wagaira)
      const product = await Product.findById(item.product);

      // 💰 Accumulator (acc) me product ka offerPrice * quantity add kar rahe hain
      // Yaani har item ka total price calculate karke acc me jodte ja rahe hain
      return acc + product.offerPrice * item.quantity;
    }, 0); // 🔢 Ye 0 initial value hai — pehle acc ki value 0 se start hoti hai
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now(),
      },
    });
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();
    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
