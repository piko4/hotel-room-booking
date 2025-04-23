"use client";

import { Star } from "lucide-react";
import Link from "next/link";

const PropertyCard = ({ properties = [] }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12 text-lg">
        No properties found for this location.
      </div>
    );
  }

  const computeAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const computeStatus = (availableRooms) =>
    availableRooms > 0 ? "Available" : "Fully Booked";

  const handleViewDetails = (property) => {
    // Save to localStorage
    localStorage.setItem("selectedProperty", JSON.stringify(property));
  };

  return (
    <div className="grid grid-cols-1 gap-8 mt-12 px-4 max-w-6xl mx-auto">
      {properties.map((property, index) => {
        const averageRating = computeAverageRating(property.reviews);
        const status = computeStatus(property.availableRooms);
        return (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row border hover:shadow-md transition duration-300"
          >
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full md:w-72 h-64 object-cover rounded-t-3xl md:rounded-t-none md:rounded-l-3xl"
            />

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {property.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {property.type} • {property.city}, {property.country}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {property.description}
                </p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.round(averageRating) ? "#facc15" : "none"}
                      stroke="#facc15"
                      className="text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({averageRating})
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{property.pricePerNight}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / night
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Available Rooms: {property.availableRooms}
                  </p>
                </div>
                <Link href="/PropertyDetails">
                  <button
                    onClick={() => handleViewDetails(property)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-6 py-2 rounded-full transition font-medium shadow-sm mt-4 sm:mt-0"
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyCard;
