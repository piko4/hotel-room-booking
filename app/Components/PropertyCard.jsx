"use client";

import { Star, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const PropertyCard = ({ properties = [] }) => {
  const [wishlist, setWishlist] = useState({});
  const [ratings, setRatings] = useState({});
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8090/USERSERVICE/auth/user", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 404) {
          setUser(null);
        } else {
          console.error("Failed to fetch user:", err);
        }
      }
    };

    fetchUser();
  }, []);

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/wishlist/user/${user.id}`,
          { withCredentials: true }
        );
        const wishMap = {};
        res.data.forEach((item) => {
          wishMap[item.propertyId] = true;
        });
        setWishlist(wishMap);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user]);

  // Toggle wishlist (add or remove)
  const toggleWishlist = async (propertyId) => {
    if (!user) {
      alert("Please log in to use wishlist.");
      return;
    }
  
    try {
      const isWished = wishlist[propertyId];
  
      if (isWished) {
        await axios.delete(
          `http://localhost:8090/RESERVATION-SERVICE/wishlist/remove`,
          {
            params: {
              userId: user.id,
              propertyId: propertyId,
            },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `http://localhost:8090/RESERVATION-SERVICE/wishlist/add`,
          null,
          {
            params: {
              userId: user.id,
              propertyId: propertyId,
            },
            withCredentials: true,
          }
        );
      }
  
      setWishlist((prev) => ({
        ...prev,
        [propertyId]: !isWished,
      }));
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };
  

  const computeStatus = (availableRooms) =>
    availableRooms > 0 ? "Available" : "Fully Booked";

  const handleViewDetails = (property) => {
    localStorage.setItem("selectedProperty", JSON.stringify(property));
  };

  // Fetch average ratings
  useEffect(() => {
    const fetchRatings = async () => {
      const newRatings = {};
      for (const property of properties) {
        try {
          const { data } = await axios.get(
            `http://localhost:8090/RESERVATION-SERVICE/reviews/property/${property.id}/average-rating`
          );
          newRatings[property.id] = data || 0;
        } catch (err) {
          console.error(`Error fetching rating for ${property.id}`, err);
          newRatings[property.id] = 0;
        }
      }
      setRatings(newRatings);
    };

    if (properties.length > 0) {
      fetchRatings();
    }
  }, [properties]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < Math.round(rating) ? "#FFC107" : "none"}
        stroke="#FFC107"
      />
    ));

  if (properties.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 text-lg">
        No properties found for this location.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 px-4">
      {/* Sidebar */}
      <aside className="hidden md:block col-span-1">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Price Range
            </label>
            <input type="range" min={1000} max={10000} className="w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>All</option>
              <option>Hotel</option>
              <option>Villa</option>
              <option>Apartment</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Cards */}
      <section className="col-span-3 space-y-6">
        {properties.map((property, index) => {
          const status = computeStatus(property.availableRooms);
          const averageRating = ratings[property.id] || 0;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition duration-200 relative"
            >
              <div className="relative w-full md:w-72 flex-shrink-0">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-64 object-cover md:rounded-l-xl"
                />
                <button
                  onClick={() => toggleWishlist(property.id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                >
                  <Heart
                    className={`${wishlist[property.id]
                      ? "text-red-500 fill-red-500"
                      : "text-gray-500"
                      }`}
                  />
                </button>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {property.title}
                  </h2>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {property.type}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin size={16} />
                    {property.city}, {property.country}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-1">
                    {renderStars(averageRating)}
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded ml-2">
                      ({averageRating})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{property.pricePerNight}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / night
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Rooms Left: {property.availableRooms}
                    </p>
                  </div>
                  <Link href="/PropertyDetails" className="w-full sm:w-auto">
                    <button
                      onClick={() => handleViewDetails(property)}
                      className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-blue-800 transition w-full sm:w-auto"
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default PropertyCard;
