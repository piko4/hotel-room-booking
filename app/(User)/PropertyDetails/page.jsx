"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const Page = () => {
  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("selectedProperty");
    if (stored) {
      setProperty(JSON.parse(stored));
    }
  }, []);

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
        if (error.response && (error.response.status === 404 || error.response.status === 401) ) { 
                   // No user is logged in – do nothing
          setUser(null);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchuser();
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();

    
    const userId = user?.id;

    if (!userId) {
      setMessage("Please log in to make a reservation.");
      return;
    }

    const reservation = {
      propertyId: property.id,
      userId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      totalPrice: numberOfRooms * property.pricePerNight, // simple calculation for total price
    };

    try {
      // Make the reservation request to the backend
      const response = await axios.post("http://localhost:8090/RESERVATION-SERVICE/reservation/create", reservation, {
        withCredentials: true, // Ensure session cookies are included if using session-based auth
      });

      // Assuming the response contains some success message or reservation details
      setMessage("Reservation successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create reservation. Try again.");
    }
  };

  if (!property) {
    return (
      <div className="text-center text-gray-500 mt-12 text-lg">
        Loading property details...
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-96 object-cover rounded-2xl mb-6"
        />

        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {property.type} • {property.city}, {property.country}
        </p>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">{property.address}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(property.rating) ? "#facc15" : "none"}
                stroke="#facc15"
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({property.rating})
            </span>
          </div>
        </div>

        <p className="mt-6 text-base">{property.description}</p>

        <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-lg">
            <span className="font-bold text-indigo-600">
              ₹{property.pricePerNight}
            </span>{" "}
            / night
          </p>
          <p className="text-sm text-gray-600">
            Available Rooms:{" "}
            <span className="font-semibold text-green-600">
              {property.availableRooms}
            </span>
          </p>
        </div>

        {/* Reserve Room */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Reserve Room</h2>
          <form className="space-y-4" onSubmit={handleReservation}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                className="w-full p-3 border rounded-md bg-white"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
              <input
                type="date"
                className="w-full p-3 border rounded-md bg-white"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Number of Rooms"
                className="w-full p-3 border rounded-md bg-white"
                value={numberOfRooms}
                min={1}
                onChange={(e) => setNumberOfRooms(Number(e.target.value))}
                required
              />
              <input
                type="number"
                placeholder="Number of Guests"
                className="w-full p-3 border rounded-md bg-white"
                value={numberOfGuests}
                min={1}
                onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-3 rounded-md hover:bg-indigo-700"
            >
              Reserve Now
            </button>
            {message && (
              <p className="mt-2 text-sm text-center text-red-600">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
