"use client";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  // ----------------------Fetch the logged-in user
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const response = await axios.get("http://localhost:8090/USERSERVICE/auth/user", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          // No user is logged in – do nothing
          setUser(null);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchuser();
  }, []);



  //----------------handlelogout---------------------------------
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8090/USERSERVICE/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Clear user data from state/localStorage
    setUser(null);
    localStorage.removeItem("user");

  };
  //--------------------------------------------------------------------------
  return (
    <div>
      <nav className="bg-indigo-900 shadow-md text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            GoBooking
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-gray-300">Home</Link>

            {/* Dropdown for Property */}
            <div className="relative">
              <button
                onMouseOver={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center hover:text-gray-300 focus:outline-none"
              >
                Property <ChevronDown className="ml-1" size={18} />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-indigo-900 text-white border rounded-md shadow-2xl z-10">
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/Hotel" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Hotels</Link>
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/Villa" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Villas</Link>
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/GuestHouse" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Guest Houses</Link>
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/Apartment" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Apartments</Link>
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/Campsite" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Campsites</Link>
                  <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)} href="/PropertyType/Hostel" className="block px-4 py-2 hover:bg-gray-200 hover:text-gray-800">Hostels</Link>
                </div>
              )}
            </div>

            <Link href="/" className="hover:text-gray-300">Popular</Link>
            <Link href="/" className="hover:text-gray-300">Holiday Packs</Link>
            <Link href="/" className="hover:text-gray-300">About</Link>
            <Link href="/" className="hover:text-gray-300">Contact</Link>
          </div>

          {/* Right Side: User/Profile or Login/Signup */}
          <div className="hidden md:flex items-center gap-x-4">
            <Link href="/partner/Login_P" className="hover:text-gray-300 flex items-center">
              List your property
            </Link>

            {user ? (
              // Show user profile if logged in
              <ProfileMenu user={user} handleLogout={handleLogout} />
            ) : (
              // Show Login and Signup buttons if not logged in
              <>
                <Link href="/Login">
                  <button className="px-4 py-1.5 border rounded-md text-white border-white hover:bg-white hover:text-blue-600">Login</button>
                </Link>
                <Link href="/Signup">
                  <button className="px-4 py-1.5 bg-white text-blue-600 rounded-md hover:bg-gray-200">  Sign Up</button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-blue-600 border-t p-4">
            <Link href="/" className="block py-2 hover:text-gray-300">Home</Link>
            <Link href="/rooms" className="block py-2 hover:text-gray-300">Rooms</Link>
            <Link href="/about" className="block py-2 hover:text-gray-300">About</Link>
            <Link href="/contact" className="block py-2 hover:text-gray-300">Contact</Link>
            <hr className="my-2 border-gray-400" />
            {user ? (
              <div className="flex flex-col items-center">
                <span className="text-white">{user.username}</span>
                <div className="w-10 h-10 flex items-center justify-center bg-white text-blue-900 font-bold rounded-full">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <>
                <Link href="/Login" className="block py-2 hover:text-gray-300">Login</Link>
                <Link href="/Signup" className="block py-2 font-semibold hover:text-gray-300">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
