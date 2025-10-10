import connectDB from "@/config/db"; // 👉 Database connection import kar rahe hain (MongoDB se connect hone ke liye)
import authSeller from "@/lib/authSeller"; // 👉 Yeh function check karega ki user seller hai ya nahi
import Product from "@/models/Product"; // 👉 Product model import kar rahe hain (database me product store karne ke liye)
import { getAuth } from "@clerk/nextjs/server"; // 👉 Clerk se user authentication data lene ke liye import
import { v2 as cloudinary } from "cloudinary"; // 👉 Cloudinary ka SDK import (image upload ke liye)
import { NextResponse } from "next/server"; // 👉 Next.js ka response object use kar rahe hain (API me response bhejne ke liye)

// 🧩 Cloudinary account configuration (yeh zaroori hai Cloudinary se connect hone ke liye)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 👉 Cloudinary ka account name env file se le rahe hain
  api_key: process.env.CLOUDINARY_API_KEY, // 👉 Cloudinary API key env file se le rahe hain
  api_secret: process.env.CLOUDINARY_API_SECRET, // 👉 Cloudinary secret key env file se le rahe hain
});

// 🧠 POST request function — jab frontend se data upload hoga tab yeh chalega
export async function POST(request) {
  try {
    // 1️⃣ Clerk se currently logged-in jo user hai uska data le rahe hain
    const { userId } = getAuth(request); // 👉 userId nikal rahe hain jo Clerk se milta hai

    // 2️⃣ Check kar rahe hain ki user seller hai ya nahi
    const isSeller = await authSeller(userId); // 👉 authSeller function check karega
    if (!isSeller) { // 👉 Agar seller nahi hai to
      return NextResponse.json({
        success: false,
        message: "User Not Authorized", // 👉 Response bhej do unauthorized ka
      });
    }

    // 3️⃣ Frontend se formData (product info + images) le rahe hain
    const formData = await request.formData(); // 👉 Request se form data extract kar rahe hain
    const name = formData.get("name"); // 👉 Product ka name
    const description = formData.get("description"); // 👉 Product ka description
    const category = formData.get("category"); // 👉 Product ka category
    const price = formData.get("price"); // 👉 Product ka price
    const offerPrice = formData.get("offerPrice"); // 👉 Discounted / offer price
    const files = formData.getAll("images"); // 👉 Saare uploaded image files nikal rahe hain (multiple ho sakte hain)

    // 4️⃣ Check kar rahe hain ki koi image file aayi bhi hai ya nahi
    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No Files Uploaded", // 👉 Agar image nahi aayi to error bhej do
      });
    }

    // 5️⃣ Ab sab images Cloudinary pe upload kar rahe hain
    const result = await Promise.all( // 👉 Promise.all se saari images ek saath upload hongi
      files.map(async (file) => { // 👉 Har file ko map karke upload kar rahe hain
        const arrayBuffer = await file.arrayBuffer(); // 👉 File ko binary data (ArrayBuffer) me convert kar rahe hain
        const buffer = Buffer.from(arrayBuffer); // 👉 ArrayBuffer ko Node.js Buffer me convert kar rahe hain

        return new Promise((resolve, reject) => {
          // 👉 Cloudinary me stream ke through file upload kar rahe hain
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" }, // 👉 Cloudinary auto detect karega image/video
            (error, result) => {
              if (error) reject(error); // 👉 Agar error aaya to reject kar do
              else resolve(result); // 👉 Agar upload ho gaya to result bhej do
            }
          );
          stream.end(buffer); // 👉 File data ko stream ke end me send kar rahe hain (upload start)
        });
      })
    );

    // 6️⃣ Saare uploaded images ke URLs nikal rahe hain
    const image = result.map((result) => result.secure_url); // 👉 Cloudinary se secure_url milta hai (public link)

    // 7️⃣ Database connect kar rahe hain (MongoDB)
    await connectDB(); // 👉 ensure karte hain DB connected hai

    // 8️⃣ New product create kar rahe hain aur database me save kar rahe hain
    const newProduct = await Product.create({
        userId, // 👉 Kis user ne product upload kiya
        name, // 👉 Product name
        description, // 👉 Product description
        category, // 👉 Product category
        price: Number(price), // 👉 Price ko number me convert kar rahe hain
        offerPrice: Number(offerPrice), // 👉 Offer price ko number me convert kar rahe hain
        image, // 👉 Cloudinary se mile hue image URLs
        date: Date.now() // Yeh date store karenga
    });

    // 9️⃣ Success response bhej rahe hain frontend ko
    return NextResponse.json({ success: true, message: 'Upload succesfully', newProduct });

  } catch (error) {
    // 🔟 Agar koi bhi error aata hai to yahan catch hoga
    console.error("Error uploading images:", error); // 👉 Console me error print kar rahe hain
    return NextResponse.json({
      success: false,
      message: error.message, // 👉 Error message frontend ko bhej rahe hain
    });
  }
}
