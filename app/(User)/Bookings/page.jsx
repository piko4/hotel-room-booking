"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/reservation/user/${user.id}`
        );
        const reservations = res.data;

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

 const handleCancelBooking = async (bookingId) => {
  const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  try {
    await axios.put(`http://localhost:8090/RESERVATION-SERVICE/reservation/cancel/${bookingId}`);
    toast.success("Booking cancelled successfully!");

    // REMOVE the cancelled booking from the UI
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  } catch (error) {
    console.error("Error cancelling booking", error);
    toast.error("Failed to cancel booking. Try again.");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg animate-pulse">Fetching your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            You haven't made any bookings yet.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row border border-gray-200 rounded-2xl shadow-sm bg-white p-5 gap-5 transition hover:shadow-md"
              >
                <img
                  src={booking.property?.imageUrl || "https://via.placeholder.com/150"}
                  alt={booking.property?.title || "Property"}
                  className="w-full sm:w-48 h-40 object-cover rounded-xl"
                />

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.property?.title || "Untitled Property"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {booking.property?.city}, {booking.property?.country}
                    </p>
                  </div>

                  <div className="grid gap-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium text-gray-600">Check-in:</span>{" "}
                      {formatDate(booking.checkInDate)}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Check-out:</span>{" "}
                      {formatDate(booking.checkOutDate)}
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

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full capitalize font-semibold tracking-wide
                        ${
                          booking.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {booking.status || "Confirmed"}
                    </span>

                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium underline ml-3"
                      >
                        Cancel
                      </button>
                    )}
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
