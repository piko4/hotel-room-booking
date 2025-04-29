"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8090";

const Page = () => {
  // State declarations (all at top)
  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [rmessage, setRMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Load property from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedProperty");
    if (stored) setProperty(JSON.parse(stored));
  }, []);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/USERSERVICE/auth/user`,
          { withCredentials: true }
        );
        setUser(data);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          setUser(null);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  // Calculate total price when dates, rooms or property change
  useEffect(() => {
    if (checkInDate && checkOutDate && property) {
      const nights = calculateNights(checkInDate, checkOutDate);
      setTotalPrice(nights * numberOfRooms * property.pricePerNight);
    }
  }, [checkInDate, checkOutDate, numberOfRooms, property]);

  // Fetch reviews & average rating when property changes
  useEffect(() => {
    if (!property?.id) return;
    fetchReviews();
    fetchAverageRating();
  }, [property?.id]);

  // Helper: calculate nights difference
  const calculateNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffMs = outDate - inDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch reviews list
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/RESERVATION-SERVICE/reviews/property/${property.id}`
      );
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/RESERVATION-SERVICE/reviews/property/${property.id}/average-rating`
      );
      setAverageRating(data);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  // Handle reservation submission
  const handleReservation = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage("Please log in to make a reservation.");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setMessage("Please select both check-in and check-out dates.");
      return;
    }
    const reservation = {
      propertyId: property.id,
      userId: user.id,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      totalPrice,
    };
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/RESERVATION-SERVICE/reservation/create`,
        reservation,
        { withCredentials: true }
      );
      setMessage("✅ Reservation successful! Enjoy your trip.");
      setCheckInDate("");
      setCheckOutDate("");
      setNumberOfRooms(1);
      setNumberOfGuests(1);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment || rating === 0) {
      setRMessage("Please provide both a review text and a rating.");
      return;
    }
    const newReview = {
      propertyId: property.id,
      userId: user.id,
      userName: user.username,
      comment,
      rating,
    };
    try {
      setIsSubmittingReview(true);
      await axios.post(
        `${API_BASE}/RESERVATION-SERVICE/reviews/create`,
        newReview,
        { withCredentials: true }
      );
      fetchReviews();
      setComment("");
      setRating(0);
      setRMessage("✅ Your review has been submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      setRMessage("❌ Failed to submit the review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Render stars helper
  const renderStars = (rat) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < Math.round(rat) ? "#FFC107" : "none"}
        stroke="#FFC107"
      />
    ));

  // Early return if no property
  if (!property) {
    return (
      <div className="text-center text-gray-500 mt-12 text-lg">
        Loading property details...
      </div>
    );
  }

  // Main UI
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
            {renderStars(averageRating)}
            <span className="text-sm text-gray-600 ml-2">({averageRating})</span>
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

        {/* Reservation Form */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Reserve Your Stay</h2>
          <form className="space-y-6" onSubmit={handleReservation}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-md bg-white"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-md bg-white"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-md bg-white"
                  value={numberOfRooms}
                  min={1}
                  onChange={(e) => setNumberOfRooms(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-md bg-white"
                  value={numberOfGuests}
                  min={1}
                  onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="text-lg font-semibold text-indigo-600">
              Total Price: ₹{totalPrice}
            </div>

            {message && (
              <p className="mt-3 text-center text-md font-medium">{message}</p>
            )}

            <button
              type="submit"
              className={`bg-indigo-600 text-white px-6 py-3 rounded-md transition hover:bg-indigo-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reserve Now"}
            </button>
          </form>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mt-8">Write a Review</h3>

          <form onSubmit={submitReview} className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Rating</p>
              <div className="flex gap-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    fill={i < rating ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="Write your review here..."
              className="w-full p-3 border rounded-md bg-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="submit"
              className={`bg-indigo-600 text-white px-6 py-3 rounded-md transition hover:bg-indigo-700 ${
                isSubmittingReview ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {rmessage && (
            <p className="mt-4 text-center text-md font-medium">{rmessage}</p>
          )}

          <h2 className="text-xl font-semibold mb-4 mt-10">Reviews</h2>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p>No reviews yet for this property.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review?.userName || "Anonymous"}</p>
                    <div className="flex gap-1 text-yellow-500">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
