"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const [user, setUser] = useState();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8090/USERSERVICE/auth/user", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch reservations and property data once user is available
  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/reservation/user/${user.id}`
        );
        const reservations = res.data;

        // Fetch property details for each reservation
        const bookingsWithProperty = await Promise.all(
          reservations.map(async (reservation) => {
            const propertyRes = await axios.get(
              `http://localhost:8090/RESERVATION-SERVICE/property/${reservation.propertyId}`
            );
            return {
              ...reservation,
              property: propertyRes.data,
            };
          })
        );

        setBookings(bookingsWithProperty);
      } catch (err) {
        console.error("Error fetching reservations or properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex border border-gray-200 rounded-2xl shadow-sm bg-white p-5 gap-5 transition hover:shadow-md"
              >
                <img
                  src={booking.property.imageUrl}
                  alt={booking.property.title}
                  className="w-40 h-32 object-cover rounded-xl"
                />

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {booking.property.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {booking.property.city}, {booking.property.country}
                    </p>
                  </div>

                  <div className="text-sm text-gray-700 mt-3 grid gap-1">
                    <p>
                      <span className="font-medium text-gray-600">Check-in:</span>{" "}
                      {booking.checkInDate}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Check-out:</span>{" "}
                      {booking.checkOutDate}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Guests:</span>{" "}
                      {booking.numberOfGuests} •{" "}
                      <span className="font-medium text-gray-600">Rooms:</span>{" "}
                      {booking.numberOfRooms}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Total:</span>{" "}
                      <span className="text-indigo-600 font-semibold">
                        ₹{booking.totalPrice}
                      </span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize font-medium tracking-wide
                        ${
                          booking.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
