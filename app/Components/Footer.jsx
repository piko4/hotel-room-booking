"use client";

import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">GoBooking</h2>
          <p className="text-sm">
            Discover and book the best hotels, villas, and apartments around the world. Trusted by thousands of travelers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/properties" className="hover:underline">Browse Properties</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
            <li><Link href="/help" className="hover:underline">Help Center</Link></li>
            <li><Link href="/partner/Login_P" className="hover:underline">Become a Partner</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm mb-2"><Mail size={16} /> support@gobooking.com</p>
          <p className="flex items-center gap-2 text-sm mb-4"><Phone size={16} /> +91 98765 43210</p>
          <div className="flex gap-4">
            <Link href="#" aria-label="Facebook"><Facebook className="hover:text-white" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="hover:text-white" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="hover:text-white" /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-gray-400 text-center py-4 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} Go Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
