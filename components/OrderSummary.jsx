import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user,setCartItems,cartItems } =
    useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(data);
      if (data.success) {
        // console.log(hello);
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      // setUserAddresses(addressDummyData);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };
const {openSignIn} = useClerk()
  const createOrder = async () => {
  try {
     if(!user){
openSignIn();
  }
    // 🏠 Step 1: Check kar rahe hain ki user ne address select kiya hai ya nahi
    if (!selectedAddress) {
      return toast.error("Please Select An Address!"); // ❌ Agar nahi kiya to error show
    }

    // 🛒 Step 2: cartItems object ko array me convert kar rahe hain
    // {productId: quantity} → [{product: productId, quantity: number}]
    let cartItemsArray = Object.keys(cartItems).map((key) => ({
      product: key,
      quantity: cartItems[key],
    }));

    // 🔍 Step 3: Agar kisi product ki quantity 0 hai to usse hata rahe hain
    cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

    // ❌ Step 4: Agar array empty hai (cart me kuch nahi), to error show karo
    if (cartItemsArray.length === 0) {
      return toast.error("Your cart is empty!");
    }

    // 🔑 Step 5: Clerk se current user ka token le rahe hain (authentication ke liye)
    const token = await getToken();

    // 📦 Step 6: Order data backend API ko bhej rahe hain
    const { data } = await axios.post(
      "/api/order/create", // 👉 API route
      {
        address: selectedAddress._id, // user ka selected address ID
        items: cartItemsArray,        // products list
      },
      { headers: { Authorization: `Bearer ${token}` } } // 🔐 secure header
    );

    // ✅ Step 7: Backend se success response aaya to
    if (data.success) {
      toast.success(data.message); // 🎉 Success message show karo
      setCartItems({});             // 🧹 Cart ko frontend se clear kar do
      router.push("/order-placed"); // 🚀 User ko "Order Placed" page par le jao
    } 
    // ❌ Agar backend se error aaya
    else {
      toast.error(data.message);
    }
  } 
  // ⚠️ Step 8: Agar koi bhi error aaya try block me
  catch (error) {
    toast.error(error.message); // 🔥 Error message show karo
  }
};
const checkUser = () => {
  if(!user){
openSignIn();
  }
}

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
