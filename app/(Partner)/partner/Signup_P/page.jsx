"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const PartnerSignup = () => {
  const [partner, setPartner] = useState({
    partnerName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setPartner({ ...partner, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8090/PARTNER-SERVICE/auth/register",
        partner,
        { withCredentials: true }
      );
      setMessage("Registration successful! 🎉");
    } catch (error) {
      setMessage(error.response?.data || "❌ Registration failed!");
    }
  };



  //----------------redirect if logged in-------------------

  // const router = useRouter();

  // useEffect(() => {
  //   const checkIfLoggedIn = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8090/PARTNERSERVICE/auth/user", {
  //         withCredentials: true,
  //       });

  //       // ✅ If user is logged in, redirect after 2 seconds
  //       if (res.status === 200 && res.data) {
  //         setTimeout(() => {
  //           router.push("/partner/dashboard");
  //         }, 2000);
  //       }
  //     } catch (err) {
  //       // Not logged in – do nothing
  //     }
  //   };

  //   checkIfLoggedIn();
  // }, [router]);
  //------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create a Partner Account
        </h2>
        <p className="text-gray-600 text-center">List your property with us</p>

        {message && (
          <p className="text-center text-sm mt-2 text-gray-700 bg-gray-200 p-2 rounded-md">
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          {/* Partner Name */}
          <div>
            <label className="block text-gray-700">Partner Name</label>
            <input
              name="partnername"
              type="text"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your business or full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              name="phone"
              type="tel"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600">
          Already have a partner account?{" "}
          <Link
            href="/partner/Login_P"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerSignup;
