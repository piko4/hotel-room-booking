"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8090/USERSERVICE/auth/register",
        user,
        { withCredentials: true }
      );

      setMessage("Registration successful! 🎉");
    } catch (error) {
      setMessage(error.response?.data || "❌ Registration failed!");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Create an Account</h2>
          <p className="text-gray-600 text-center">Sign up to book your stay</p>

          {message && (
            <p className="text-center text-sm mt-2 text-gray-700 bg-gray-200 p-2 rounded-md">
              {message}
            </p>
          )}

          <form onSubmit={handleRegister} className="mt-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                name="username"
                type="text"
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="mt-4">
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
            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter a strong password"
                required
              />
            </div>

            {/* Sign-Up Button */}
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/Login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
