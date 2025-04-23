"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";

export default function ProfileMenu_P({ partner, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
//--------------------------------------------------------------------------
  return (
    <div className="relative text-white" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-indigo-800 transition duration-200"
      >
        <UserCircle size={28} className="text-white" />
        <span className="font-medium">{partner.partnername}</span>
        <ChevronDown size={18} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white text-indigo-900 shadow-lg rounded-md z-10">
          <Link
            href="/partner/Dashboard"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/partner/profile"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/partner/AddProperty"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Add new property
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
