"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import PropertyCard from './PropertyCard';

function HeroSection() {
    const [location, setLocation] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [properties, setProperties] = useState([]); // store fetched properties

    const handleSearch = async () => {
        if (!location.trim()) return;

        try {
            const res = await fetch(`http://localhost:8090/RESERVATION-SERVICE/property/location/${location}`);
            const data = await res.json();
            setProperties(data);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
        }
    };

    return (
        <>
            <section
                className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
                style={{
                    backgroundImage: "url('https://plus.unsplash.com/premium_photo-1682056762907-23d08f913805?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            >
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800" style={{
                        textShadow: `0 0 4px rgba(255, 255, 255, 0.9),0 0 8px rgba(255, 255, 255, 0.8),0 0 12px rgba(255, 255, 255, 0.7)`
                    }}>
                        Find Your Perfect Stay
                    </h1>

                    <p className="text-lg text-gray-800 mt-4 max-w-xl mx-auto" style={{
                        textShadow: ` 0 0 3px rgba(255, 255, 255, 0.9),0 0 6px rgba(255, 255, 255, 0.8),0 0 10px rgba(255, 255, 255, 0.7)`
                    }}>
                        Book the best hotels at unbeatable prices. Comfort, luxury, and relaxation await you.
                    </p>




                    {/* Search Box */}
                    <div className="mt-8 bg-white/50 shadow-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
                        {/* Location Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Search Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter destination..."
                                    className="text-gray-700 w-full pl-10 pr-4 py-3 bg-gray-100 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Date & Guest Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Check-in Date */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Check-in</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-500" size={20} />
                                    <input
                                        type="date"
                                        className="text-gray-700 w-full pl-10 pr-4 py-3 bg-gray-100 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                            {/* Check-out Date */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Check-out</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-500" size={20} />
                                    <input
                                        type="date"
                                        className=" text-gray-700 w-full pl-10 pr-4 py-3 bg-gray-100 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                            {/* Guests & Rooms Dropdown */}
                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">Guests & Rooms</label>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-gray-700 w-full flex justify-between items-center pl-4 pr-4 py-3 bg-gray-100 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400 "
                                >
                                    {adults} Adults, {children} Children, {rooms} Rooms
                                    <ChevronDown size={20} className="text-gray-500" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10 p-4">
                                        {/* Adults */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700">Adults</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-white px-2 py-1 bg-gray-600 rounded">-</button>
                                                <span className='text-gray-600'>{adults}</span>
                                                <button onClick={() => setAdults(adults + 1)} className="text-white px-2 py-1 bg-gray-600 rounded">+</button>
                                            </div>
                                        </div>
                                        {/* Children */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700">Children</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setChildren(Math.max(0, children - 1))} className="text-white px-2 py-1 bg-gray-600 rounded">-</button>
                                                <span className='text-gray-600'>{children}</span>
                                                <button onClick={() => setChildren(children + 1)} className="text-white px-2 py-1 bg-gray-600 rounded">+</button>
                                            </div>
                                        </div>
                                        {/* Rooms */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Rooms</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="text-white px-2 py-1 bg-gray-600 rounded">-</button>
                                                <span className='text-gray-600'>{rooms}</span>
                                                <button onClick={() => setRooms(rooms + 1)} className="text-white px-2 py-1 bg-gray-600 rounded">+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSearch}
                                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Show Properties Below HeroSection */}
            {properties.length > 0 && (
                <section className="bg-gray-50 py-10">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
                            Showing results for <span className="text-indigo-600">"{location}"</span>
                        </h2>

                        <PropertyCard properties={properties} />
                    </div>
                </section>
            )}


        </>
    );
}

export default HeroSection;
