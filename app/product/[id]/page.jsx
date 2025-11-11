"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/nextjs";

const Product = () => {
  const { id } = useParams();
  const { openSignIn } = useClerk();
  const { products, router, addToCart, user } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  return productData ? (
    <>
      <Navbar />
      <div className="max-w-[1490px] mx-auto px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-3 lg:px-12 xl:px-14">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 aspect-[10/9] relative">
              <Image
                src={mainImage || productData.image[0]}
                alt="alt"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 aspect-square relative"
                >
                  <Image
                    src={image}
                    alt="alt"
                    fill
                    className="object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">
              ₹{productData.offerPrice}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                ₹{productData.price}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Brand</td>
                    <td className="text-gray-800/50 ">Generic</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Color</td>
                    <td className="text-gray-800/50 ">Multi</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => {
                  addToCart(productData._id);
                  toast.success("Item added successfully!", {
                    position: "top-right",
                    duration: 3000, // 3 seconds
                    style: { background: "#333", color: "#fff" },
                  });
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  if (user) {
                    router.push("/cart");
                  } else {
                    openSignIn();
                  }
                  // router.push("/cart");
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import ProductCard from "@/components/ProductCard";
// import Loading from "@/components/Loading";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import { Pencil } from "lucide-react"; // Import for the edit icon

// const Product = () => {
//   const { id } = useParams();
//   const { products, router, getToken,addToCart } = useAppContext();

//   const [productData, setProductData] = useState(null);
//   const [editableData, setEditableData] = useState({});
//   const [mainImage, setMainImage] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   // Renamed to singular as we'll replace one at a time for simplicity
//   const [newImageFile, setNewImageFile] = useState(null);
//   const [imageToReplaceIndex, setImageToReplaceIndex] = useState(null); // Tracks which old image index to replace
//   const imageInputRef = useRef(null); // Ref for the hidden file input

//   // 🧠 Load product data
//   useEffect(() => {
//     if (products.length > 0) {
//       const product = products.find((p) => p._id === id);
//       if (product) {
//         setProductData(product);
//         setEditableData(product);
//         setMainImage(product.image?.[0] || null);
//       }
//     }
//   }, [id, products]);

//   // 🧾 Handle input field change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🖼️ Handle new image upload for replacement
//   const handleReplacementImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && imageToReplaceIndex !== null) {
//       setNewImageFile(file);
//       // Immediately set the main image to the preview URL
//       setMainImage(URL.createObjectURL(file));

//       // Update the editableData image array temporarily for thumbnail preview
//       const updatedImages = [...editableData.image];
//       updatedImages[imageToReplaceIndex] = URL.createObjectURL(file);
//       setEditableData((prev) => ({ ...prev, image: updatedImages }));
//     }
//     // Reset the file input value so same file can be selected again
//     e.target.value = null;
//   };

//   // 🖱️ Handles click on a thumbnail to initiate image replacement
//   const handleThumbnailClick = (image, index) => {
//     setMainImage(image);
//     if (isEditing) {
//       setImageToReplaceIndex(index);
//       imageInputRef.current.click(); // Programmatically click the hidden file input
//     }
//   };

//   // 🧹 Cancel editing
//   const handleCancel = () => {
//     setEditableData(productData);
//     setNewImageFile(null);
//     setImageToReplaceIndex(null);
//     setMainImage(productData.image?.[0] || null); // Reset main image to first original
//     setIsEditing(false);
//   };

//   // 💾 Save product edits
//   const handleSaveEditData = async () => {
//     try {
//       const token = await getToken();
//       const formData = new FormData();

//       formData.append("name", editableData.name);
//       formData.append("description", editableData.description);
//       formData.append("price", editableData.price);
//       formData.append("offerPrice", editableData.offerPrice);
//       formData.append("category", editableData.category);

//       // Upload new image for replacement only if user selected one
//       if (newImageFile && imageToReplaceIndex !== null) {
//         formData.append("imageFile", newImageFile);
//         formData.append("imageIndex", imageToReplaceIndex); // Send the index to the backend
//       }

//       const { data } = await axios.patch(`/api/product/edit/${id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         // Use the data from the server which has the permanent Cloudinary URL
//         setProductData(data.data);
//         setEditableData(data.data);
//         setMainImage(data.data.image?.[0]);
//         setIsEditing(false);
//         setNewImageFile(null);
//         setImageToReplaceIndex(null);
//         toast.success("Product updated successfully!");
//       } else {
//         toast.error(data.message || "Failed to update");
//       }
//     } catch (error) {
//       console.error("Error saving edit:", error);
//       toast.error("Something went wrong while saving!");
//     }
//   };

//   if (!productData) return <Loading />;

//   return (
//     <>
//       <Navbar />
//       <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
//           {/* LEFT SECTION */}
//           <div className="px-5 lg:px-16 xl:px-20">
//             {/* MAIN IMAGE */}
//             <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
//               <Image
//                 src={mainImage || editableData.image?.[0]}
//                 alt="product"
//                 className="w-full h-auto object-cover"
//                 width={1280}
//                 height={720}
//               />
//             </div>

//             {/* IMAGE GRID */}
//             <div className="grid grid-cols-4 gap-4">
//               {editableData.image?.map((image, index) => (
//                 <div
//                   key={`old-${index}`}
//                   onClick={() => handleThumbnailClick(image, index)}
//                   // The container needs 'relative' for the absolute-positioned edit icon
//                   className={`relative cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-orange-500 transition ${mainImage === image ? 'ring-2 ring-orange-500' : ''}`}
//                 >
//                   <Image
//                     // Use a unique key for images that are being replaced to force re-render
//                     key={image}
//                     src={image}
//                     alt="thumbnail"
//                     className="w-full h-auto object-cover"
//                     width={300}
//                     height={200}
//                   />
//                   {/* Edit Pencil Icon (only when editing) */}
//                   {isEditing && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition opacity-0 hover:opacity-100">
//                       <Pencil className="text-white text-xl" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {/* This file input is hidden and is triggered when a thumbnail is clicked in edit mode */}
//               {isEditing && (
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleReplacementImageChange}
//                   ref={imageInputRef}
//                   style={{ display: 'none' }}
//                 />
//               )}
//             </div>

//             {/* NO UPLOAD NEW IMAGES BLOCK - Replaced by thumbnail click logic */}
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="flex flex-col">
//             {/* EDIT / SAVE BUTTONS */}
//             <div className="flex justify-end mb-3 gap-3">
//               {isEditing ? (
//                 <>
//                   <button
//                     onClick={handleSaveEditData}
//                     className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {/* PRODUCT INFO */}
//             {isEditing ? (
//               <>
//                 <input
//                   name="name"
//                   value={editableData.name || ""}
//                   onChange={handleChange}
//                   className="text-3xl font-medium text-gray-800/90 mb-4 border rounded px-3 py-2"
//                 />
//                 <textarea
//                   name="description"
//                   value={editableData.description || ""}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2 text-gray-600 mb-4"
//                 />
//                 <div className="flex items-center gap-2 mb-4">
//                   {/* Removed currency symbol input for simplicity */}
//                   <span className="text-3xl font-medium">₹</span>
//                   <input
//                     name="offerPrice"
//                     type="number"
//                     value={editableData.offerPrice || ""}
//                     onChange={handleChange}
//                     className="text-3xl font-medium border rounded px-3 py-2 w-32"
//                   />
//                   <span className="text-base font-normal text-gray-800/60 line-through">₹</span>
//                   <input
//                     name="price"
//                     type="number"
//                     value={editableData.price || ""}
//                     onChange={handleChange}
//                     className="text-base font-normal text-gray-800/60 line-through border rounded px-3 py-2 w-32"
//                   />
//                 </div>
//                 {/* Category Input/Dropdown should be added here for full editability */}
//                 <div className="flex items-center gap-2 mb-4">
//                     <label className="text-gray-600 font-medium">Category:</label>
//                     <input
//                       name="category"
//                       value={editableData.category || ""}
//                       onChange={handleChange}
//                       className="border rounded px-3 py-2"
//                     />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
//                   {productData.name}
//                 </h1>
//                 <p className="text-gray-600 mt-3">{productData.description}</p>
//                 <p className="text-3xl font-medium mt-6">
//                   ₹{productData.offerPrice}
//                   <span className="text-base font-normal text-gray-800/60 line-through ml-2">
//                     ₹{productData.price}
//                   </span>
//                 </p>
//               </>
//             )}

//             <hr className="bg-gray-600 my-6" />

//             <div className="overflow-x-auto">
//               <table className="table-auto border-collapse w-full max-w-72">
//                 <tbody>
//                   <tr>
//                     <td className="text-gray-600 font-medium">Category</td>
//                     <td className="text-gray-800/50">
//                       {editableData.category || "-"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//               <div className="flex items-center mt-10 gap-4">
//               <button
//                 onClick={() => {
//                   addToCart(productData._id);
//                   toast.success("Item added successfully!", {
//                     position: "top-right",
//                     duration: 3000, // 3 seconds
//                     style: { background: "#333", color: "#fff" },
//                   });
//                 }}
//                 className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={() => {
//                   addToCart(productData._id);
//                   router.push("/cart");
//                 }}
//                 className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
//               >
//                 Buy now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* FEATURED PRODUCTS */}
//         <div className="flex flex-col items-center">
//           <div className="flex flex-col items-center mb-4 mt-16">
//             <p className="text-3xl font-medium">
//               Featured <span className="text-orange-600">Products</span>
//             </p>
//             <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
//             {products.slice(0, 5).map((product, index) => (
//               <ProductCard key={index} product={product} />
//             ))}
//           </div>
//           <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
//             See more
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Product;
