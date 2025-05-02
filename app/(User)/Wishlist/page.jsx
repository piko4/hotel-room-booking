'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star, Trash2 } from "lucide-react";
import Link from "next/link";

const page = () => {
  const [user, setUser] = useState(null);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8090/USERSERVICE/auth/user", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Fetch wishlist properties
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      try {
        const wishlistRes = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/wishlist/user/${user.id}`,
          { withCredentials: true }
        );

        const propertyPromises = wishlistRes.data.map((item) =>
          axios.get(`http://localhost:8090/RESERVATION-SERVICE/property/${item.propertyId}`)
        );

        const propertyResponses = await Promise.all(propertyPromises);
        const properties = propertyResponses.map((res) => res.data);

        setWishlistProperties(properties);
      } catch (err) {
        console.error("Failed to fetch wishlist properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Fetch average ratings for properties
  useEffect(() => {
    const fetchRatings = async () => {
      const newRatings = {};
      await Promise.all(
        wishlistProperties.map(async (property) => {
          try {
            const res = await axios.get(
              `http://localhost:8090/RESERVATION-SERVICE/reviews/property/${property.id}/average-rating`
            );
            newRatings[property.id] = res.data;
          } catch (err) {
            console.error(`Failed to fetch rating for property ${property.id}`, err);
            newRatings[property.id] = 0;
          }
        })
      );
      setRatings(newRatings);
    };

    if (wishlistProperties.length > 0) {
      fetchRatings();
    }
  }, [wishlistProperties]);

  // ✅ FIXED handleRemove
  const handleRemove = async (propertyId) => {
    if (!user) return;

    try {
      await axios.delete("http://localhost:8090/RESERVATION-SERVICE/wishlist/remove", {
        params: {
          userId: user.id,
          propertyId: propertyId,
        },
        withCredentials: true,
      });

      setWishlistProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleViewDetails = (property) => {
    localStorage.setItem("selectedProperty", JSON.stringify(property));
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < Math.round(rating) ? "#FFC107" : "none"}
        stroke="#FFC107"
      />
    ));

  if (loading) {
    return <div className="text-center py-10">Loading your wishlist...</div>;
  }

  if (wishlistProperties.length === 0) {
    return <div className="text-center py-10 text-gray-500">Your wishlist is empty.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {wishlistProperties.map((property) => {
        const avgRating = ratings[property.id] ?? 0;

        return (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col"
          >
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{property.title}</h2>
                <p className="text-xs text-gray-500 uppercase">{property.type}</p>
                <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin size={16} />
                  {property.city}, {property.country}
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {property.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {renderStars(avgRating)}
                  <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 rounded">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-lg font-bold text-gray-900">
                  ₹{property.pricePerNight}
                  <span className="text-sm font-medium text-gray-600"> / night</span>
                </p>
                <p className="text-sm text-gray-500">Rooms Left: {property.availableRooms}</p>
              </div>

              <div className="mt-4 flex justify-between items-center gap-2">
                <Link href="/PropertyDetails" className="w-full">
                  <button
                    onClick={() => handleViewDetails(property)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-md transition"
                  >
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => handleRemove(property.id)}
                  className="p-2 rounded-md border border-gray-300 hover:bg-red-100 transition text-red-600"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default page;
