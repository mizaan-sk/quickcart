"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "",number:"", message: "" });
  };

  return (
    <>
      <Navbar />
        <section className="relative w-full h-[200px] md:h-[300px] bg-[#E6E9F2] overflow-hidden">
      
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold">Contact QuickCart</h1>
        </div>
      </section>

      <div className=" bg-gray-50 text-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1> */}

          <div className="bg-white shadow-lg rounded-lg p-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-lg leading-relaxed mb-6">
                Have questions, feedback, or need help with your order? We're
                here to assist you.
              </p>
              <p className="text-md mb-2">
                <strong>Email:</strong> support@quickcart.com
              </p>
              <p className="text-md mb-2">
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p className="text-md">
                <strong>Address:</strong> Mumbai, India
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring focus:ring-blue-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring focus:ring-blue-400"
              />
              <input
                type="number"
                name="number"
                placeholder="Your Number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring focus:ring-blue-400"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring focus:ring-blue-400"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black text-white py-3 rounded text-lg font-medium transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
