"use client";
import React, { useState, useEffect, useRef } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, products } = useAppContext();
  const { openSignIn } = useClerk();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    });

    setSearchResults(filtered.slice(0, 8)); // Show top 8 results
  }, [searchQuery, products]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const handleProductClick = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push("/product/" + productId);
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/all-products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative bg-white z-40">
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
        />

        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-gray-900 transition">
            Shop
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-900 transition">
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 transition"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        <ul className="hidden md:flex items-center gap-6">
          <Link
            href="/cart"
            className="hover:text-gray-900 transition flex items-center gap-1"
          >
            <CartIcon />
          </Link>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-gray-900 transition cursor-pointer"
          >
            <Image
              className="md:w-5 w-7 h-7 md:h-5"
              src={assets.search_icon}
              alt="search icon"
            />
          </button>

          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="Home"
                  labelIcon={<HomeIcon />}
                  onClick={() => router.push("/")}
                />
                <UserButton.Action
                  label="Products"
                  labelIcon={<BoxIcon />}
                  onClick={() => router.push("/all-products")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 hover:text-gray-900 transition "
            >
              <Image src={assets.user_icon} className="md:w-5 w-7 h-7 md:h-5" alt="user icon" />
              Account
            </button>
          )}
        </ul>

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden gap-3">
            <Link
            href="/cart"
            className="hover:text-gray-900 transition flex items-center gap-1"
          >
            <CartIcon />
          </Link>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-gray-900 transition"
          >
            <Image
              className="w-6 h-6"
              src={assets.search_icon}
              alt="search icon"
            />
          </button>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
            >
              Seller
            </button>
          )}

          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="Home"
                  labelIcon={<HomeIcon />}
                  onClick={() => router.push("/")}
                />
                <UserButton.Action
                  label="Products"
                  labelIcon={<BoxIcon />}
                  onClick={() => router.push("/all-products")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 hover:text-gray-900 transition"
            >
              <Image
                className="w-6 h-6"
                src={assets.user_icon}
                alt="user icon"
              />
            </button>
          )}
        </div>
      </nav>

      {/* Full-Width Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
          onClick={closeSearch}
        >
          <div
            ref={searchRef}
            className="bg-white w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="border-b border-gray-200 px-6 md:px-16 lg:px-32 py-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Image
                    className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-40"
                    src={assets.search_icon}
                    alt="search icon"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search for products, categories..."
                    className="w-full pl-12 pr-12 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={closeSearch}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Search Results Container */}
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto bg-gray-50">
              <div className="px-6 md:px-16 lg:px-32 py-6">
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Products ({searchResults.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                      {searchResults.map((product) => (
                        <div
                          key={product._id || product.id}
                          onClick={() =>
                            handleProductClick(product._id || product.id)
                          }
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition border-b md:border-r border-gray-100"
                        >
                          {product.image && (
                            <img
                              src={product.image[0] || product.image}
                              alt={product.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {product.category}
                            </p>
                            <p className="text-base font-bold text-gray-900 mt-2">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {searchResults.length >= 8 && (
                      <button
                        onClick={(e) => handleSearchSubmit(e)}
                        className="w-full p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition text-center border-t border-gray-200"
                      >
                        View all results for "{searchQuery}" →
                      </button>
                    )}
                  </div>
                )}

                {/* No Results */}
                {searchQuery && searchResults.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Image
                        className="w-8 h-8 opacity-40"
                        src={assets.search_icon}
                        alt="search icon"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Try searching with different keywords or browse our
                      collections
                    </p>
                    <button
                      onClick={() => {
                        closeSearch();
                        router.push("/all-products");
                      }}
                      className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      Browse All Products
                    </button>
                  </div>
                )}

                {/* Initial State - Popular Categories or Recent Searches */}
                {!searchQuery && (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Popular Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Electronics",
                        "Clothing",
                        "Home & Garden",
                        "Sports",
                        "Books",
                        "Toys",
                      ].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSearchQuery(category)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
