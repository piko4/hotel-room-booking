"use client";
import axios from "axios";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProfileMenu_P from "./ProfileMenu_P";
import { useRouter } from "next/router";

function Navbar_P() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [partner, setPartner] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await axios.get("http://localhost:8090/PARTNER-SERVICE/auth/partner", {
          withCredentials: true,
        });
        setPartner(response.data);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          setPartner(null);
        } else {
          console.error("Error fetching partner:", error);
        }
      }
    };
    fetchPartner();
  }, []);

  //----------------Logout----------------
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8090/PARTNER-SERVICE/auth/logout", {}, { withCredentials: true });
      setPartner(null);
      localStorage.removeItem("partner");
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!hasMounted) return null;
//--------------------------------------------------------------------------
  return (
    <nav className="bg-blue-900 shadow-md text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          GoBooking Partner
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/partner/Dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/partner/properties" className="hover:text-gray-300">My Listings</Link>
          <Link href="/partner/bookings" className="hover:text-gray-300">Bookings</Link>
          <Link href="/partner/support" className="hover:text-gray-300">Support</Link>
        </div>

        {/* Profile / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 relative">
          {partner ? (
           <ProfileMenu_P partner={partner} handleLogout={handleLogout}/>
          ) : (
            <>
              <Link href="/partner/Login_P">
                <button className="px-4 py-1.5 border rounded-md text-white border-white hover:bg-white hover:text-blue-600">Login</button>
              </Link>
              <Link href="/partner/Signup_P">
                <button className="px-4 py-1.5 bg-white text-blue-600 rounded-md hover:bg-gray-200">Sign Up</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 border-t p-4 space-y-2">
          <Link href="/partner/Dashboard" className="block hover:text-gray-300">Dashboard</Link>
          <Link href="/partner/properties" className="block hover:text-gray-300">My Listings</Link>
          <Link href="/partner/bookings" className="block hover:text-gray-300">Bookings</Link>
          <Link href="/partner/support" className="block hover:text-gray-300">Support</Link>
          {!partner && (
            <Link href="/partner/Signup_P" className="block hover:text-gray-300">List Your Property</Link>
          )}
          <hr className="border-gray-400" />

          {partner ? (
            <>
              <span className="block">{partner.firstName}</span>
              <button onClick={handleLogout} className="block w-full text-left hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/partner/Login_P" className="block hover:text-gray-300">Login</Link>
              <Link href="/partner/Signup_P" className="block font-semibold hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar_P;
