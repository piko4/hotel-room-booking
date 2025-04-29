"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const PartnerLogin = () => {
  const [partner, setPartner] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setPartner({ ...partner, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8090/PARTNER-SERVICE/auth/login",
        partner,
        { withCredentials: true }
      );

      setMessage("Login successful! 🎉");

      setTimeout(() => {
        window.location.reload(); // Optional refresh
      }, 2000);

      router.push("/partner/Dashboard"); // or wherever the partner lands after login
    } catch (error) {
      setMessage((error.response?.data || "❌ Login failed!") + " ❌");
    }
  };
 


  
  //--------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Partner Login
        </h2>
        <p className="text-gray-600 text-center">Access your partner account</p>

        {message && (
          <p className="text-center text-sm mt-2 text-gray-700 bg-gray-200 p-2 rounded-md">
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your partner email"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="mt-4 flex justify-between items-center">
            <Link
              href="/partner/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up Redirect */}
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have a partner account?{" "}
          <Link
            href="/partner/Signup_P"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerLogin;
