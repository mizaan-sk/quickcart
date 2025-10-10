import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = await request.json(); // 👈 get productId from body

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    await connectDB();

    // Delete only if the product belongs to the user (optional but secure)
    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      userId, // only allow deleting your own products
    });

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        message: "Product does not exist or not owned by you!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
