// "use client";
// import React, { useEffect, useState } from "react";
// import { assets, productsDummyData } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/seller/Footer";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const ProductList = () => {
//   const { router } = useAppContext();
//   const { getToken, user } = useAppContext();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSellerProduct = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/product/seller-list", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // console.log({data})
//       if (data.success) {
//         setProducts(data.Products);
//         setLoading(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };
//   const deleteProduct = async (productId) => {
//   try {
//     const token = await getToken();
//     const { data } = await axios.delete("/api/product/delete", {
//       headers: { Authorization: `Bearer ${token}` },
//       data: { productId }, // 👈 send product ID to backend
//     });

//     if (data.success) {
//       toast.success("Product removed successfully!");
//       // Remove deleted product from the UI immediately
//       setProducts((prev) => prev.filter((item) => item._id !== productId));
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     toast.error(error.message);
//     console.error(error);
//   }
// };
// // const editProduct = (productId) => {}
//   useEffect(() => {
//     if (user) {
//       fetchSellerProduct();
//     }
//   }, [user]);

//   return (
//     <div className="flex-1 min-h-screen flex flex-col justify-between">
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="w-full md:p-10 p-4">
//           <h2 className="pb-4 text-lg font-medium">All Product</h2>
//           <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//             <table className=" table-fixed w-full overflow-hidden">
//               <thead className="text-gray-900 text-sm text-left">
//                 <tr>
//                   <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
//                     Product
//                   </th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">
//                     Category
//                   </th>
//                   <th className="px-4 py-3 font-medium truncate">Price</th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">
//                     Edit
//                   </th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">
//                     Remove
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm text-gray-500">
//                 {products.map((product, index) => (
//                   <tr key={index} className="border-t border-gray-500/20">
//                     <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
//                       <div className="bg-gray-500/10 rounded p-2">
//                         <Image
//                           src={product.image[0]}
//                           alt="product Image"
//                           className="w-16"
//                           width={1280}
//                           height={720}
//                         />
//                       </div>
//                       <span className="truncate w-full">{product.name}</span>
//                     </td>
//                     <td className="px-4 py-3 max-sm:hidden">
//                       {product.category}
//                     </td>
//                     <td className="px-4 py-3">₹{product.offerPrice}</td>
//                     <td className="px-4 py-3 max-sm:hidden">
//                       <button
//                         onClick={() => router.push(`/edit/${product._id}`)}
//                         className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
//                       >
//                         <span className="hidden md:block">Edit</span>
//                         <Image
//                           className="h-3.5"
//                           src={assets.redirect_icon}
//                           alt="redirect_icon"
//                         />
//                       </button>
//                     </td>
//                     <td>
//                       <button  onClick={() => deleteProduct(product._id)} className="px-4 py-3">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default ProductList;
"use client";
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router } = useAppContext();
  const { getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log({data})
      if (data.success) {
        setProducts(data.Products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteProduct = async (productId) => {
  try {
    const token = await getToken();
    const { data } = await axios.delete("/api/product/delete", {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId }, // 👈 send product ID to backend
    });

    if (data.success) {
      toast.success("Product removed successfully!");
      // Remove deleted product from the UI immediately
      setProducts((prev) => prev.filter((item) => item._id !== productId));
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error(error);
  }
};
// const editProduct = (productId) => {}
  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full p-10 ">
          <h2 className="pb-4 text-lg font-medium">All Product</h2>
           <div className="w-full rounded-md bg-white border border-gray-500/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-gray-900 text-sm text-left bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Product</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Category</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Price</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Edit</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Remove</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {products.map((product, index) => (
              <tr key={index} className="border-t border-gray-500/20 hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                  <div className="bg-gray-500/10 rounded p-2 flex-shrink-0">
                    <Image
                      src={product.image[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="hidden sm:inline">{product.name}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{product.category}</td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">₹{product.offerPrice}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => router.push(`/edit/${product._id}`)}
                    className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <span className="text-sm">Edit</span>
                    <Image
                      src={assets.redirect_icon || "/placeholder.svg"}
                      alt="edit"
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
