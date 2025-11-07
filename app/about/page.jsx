"use client";
import Image from "next/image";
import asus_laptop_image from "@/assets/asus_laptop_image.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function AboutPage() {
  return (
  <>
  <Navbar/>
  <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[200px] md:h-[300px] bg-[#E6E9F2] overflow-hidden">
      
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold">About QuickCart</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <h2 className="text-3xl font-semibold text-gray-900">Who We Are</h2>
        <p className="text-lg leading-relaxed">
          QuickCart is your trusted e-commerce destination designed to make online shopping simple, fast, and reliable. Whether you're looking for everyday essentials, the latest gadgets, home goods, fashion items, or unique finds — QuickCart delivers quality products right to your doorstep.
        </p>

        {/* Image + Text row */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              Our mission is to create a seamless shopping experience for everyone. We work with trusted suppliers, maintain competitive pricing, and ensure secure and fast delivery. Customer satisfaction is our top priority.
            </p>
          </div>
          <div className="flex items-center justify-center relative rounded-lg overflow-hidden shadow-lg">
            <Image
          src={asus_laptop_image}
              alt="Our Mission Image"
              width={400}
              height={400}
              className="object-cover w-100 h-100"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">Why Choose QuickCart?</h3>
          <ul className="space-y-4 text-lg list-disc pl-6">
            <li>Wide range of quality products</li>
            <li>Fast and secure delivery</li>
            <li>Simple, clean, and user-friendly shopping experience</li>
            <li>Reliable customer support</li>
            <li>Trusted and transparent pricing</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <a
            href="/all-products"
            className="bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black text-white px-6 py-3 rounded-full text-lg font-medium transition"
          >
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  <Footer/>
  </>
  );
}