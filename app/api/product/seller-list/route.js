import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({
        success: false,
        message: "User Not Authorized",
      });
    }
    await connectDB();
    const Products = await Product.find({});
    return NextResponse.json({success:true , Products})
  } catch (error) {
    return NextResponse.json({success:false,message:error.message})
  }
}
