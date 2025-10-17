import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// 🧩 Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a single file to Cloudinary
const uploadFileToCloudinary = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Handles PATCH requests to update a product.
 * @param {Request} request The incoming Next.js Request object.
 * @param {{ params: Promise<{ id: string }> }} context The context containing route parameters.
 */
export async function PATCH(request, context) {
    try {
    // ✅ Correct way to access dynamic route param
    const { params } = context;
    const id = params.id; // just access directly

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is missing" },
        { status: 400 }
      );
    }

    const { userId } = getAuth(request);

    await connectDB();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Optional: Restrict edits to product owner
    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Determine request type
    const contentType = request.headers.get("content-type");
    let updatedData = {};
    let finalUpdate = { ...existing.toObject() };

    if (contentType?.includes("application/json")) {
      // Normal text-only edits
      updatedData = await request.json();
      finalUpdate = { ...finalUpdate, ...updatedData };
    } else if (contentType?.includes("multipart/form-data")) {
      // FormData edits (possible image upload)
      const formData = await request.formData();

      updatedData = {
        name: formData.get("name"),
        description: formData.get("description"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        offerPrice: Number(formData.get("offerPrice")),
      };

      finalUpdate = { ...finalUpdate, ...updatedData };

      // Handle single image replacement
      const imageFile = formData.get("imageFile");
      const imageIndex = parseInt(formData.get("imageIndex"), 10);

      if (imageFile instanceof File && imageFile.name !== "undefined" && !isNaN(imageIndex)) {
        const imageUrl = await uploadFileToCloudinary(imageFile);

        if (finalUpdate.image && Array.isArray(finalUpdate.image)) {
          finalUpdate.image[imageIndex] = imageUrl;
        } else {
          finalUpdate.image = [imageUrl];
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported Content Type" },
        { status: 415 }
      );
    }

    // Update the product in DB
    const updatedProduct = await Product.findByIdAndUpdate(id, finalUpdate, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
