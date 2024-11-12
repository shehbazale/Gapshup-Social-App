"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, auth, signOut } from "../config/firebase.js";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User:", user);
      } else {
        console.log("User logged out");
        window.location.href = "/";
      }
    });
    return () => userLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <>
      <div className="flex sticky top-0 z-50 py-3 shadow-xl justify-between items-center border-b border-gray-300 flex-wrap px-2 md:px-32 backdrop-blur-sm bg-white/70">
        <div className="flex items-center">
          <img src="/logo.png" className="w-20 h-14" alt="logo" />
        </div>
        <div className="relative flex items-center md:inline-flex">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-200 rounded-md py-2 px-2 w-96"
          />
          <svg
            className="absolute right-2 h-6 w-6 text-gray-400 hover:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="relative flex items-center gap-2">
          <span className="block px-4 py-2 text-base truncate">
            {user?.email}
          </span>
          <img
            src={user?.photoURL || "/profile.png"}
            alt="profile"
            width={35}
            height={35}
            className="cursor-pointer rounded-full"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-24 bg-white shadow-md rounded-md w-32 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
