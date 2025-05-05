import { useState } from "react";
import Link from "next/link";

const ProfileMenu = ({ user, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative z-15 px-2">
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 flex items-center justify-center bg-white text-blue-900 font-bold rounded-full">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-white">{user.username}</span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
          <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/account">
            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              My Account
            </div>
          </Link>
          <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/Bookings">
            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              My Bookings
            </div>
          </Link>
          <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/Wishlist">
            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              Wishlist
            </div>
          </Link>
          <hr className="border-gray-300" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
