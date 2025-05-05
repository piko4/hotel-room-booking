"use client"
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {

  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  //----------------handlelogin----------------

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8090/USERSERVICE/auth/login",
        user,
        { withCredentials: true }
      );

      setMessage("Login successful! 🎉");

      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 1000);

      router.push("/")
    } catch (error) {
      setMessage(error.response?.data + "❌ Login failed!");
    }
  };

  return (
    <div >
      <div
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1682056762907-23d08f913805?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center">Log in to continue</p>
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
                name='email'
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
                name='password'
                type="password"
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password & Submit */}
            <div className="mt-4 flex justify-between items-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/Signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
