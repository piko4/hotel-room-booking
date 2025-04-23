"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [partner, setPartner] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/PARTNER-SERVICE/auth/partner",
          { withCredentials: true }
        );
        setPartner(response.data);
      } catch (error) {
        console.error("Error fetching partner:", error);
        setPartner(null);
      }
    };

    fetchPartner();
  }, []);

  useEffect(() => {
    if (!partner) return;

    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/property/partner/${partner.id}`,
          { withCredentials: true }
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [partner]);

  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString();
    setTodayDate(currentDate);
  }, []);

  //--------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Partner Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-medium">{partner?.name}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-500">{todayDate}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Total Properties"
          count={properties.length}
          color="bg-indigo-500"
        />
        <DashboardCard
          title="Total Reserved Rooms"
          count={properties.reduce((sum, prop) => sum + prop.reservedRooms, 0)}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Total Available Rooms"
          count={properties.reduce((sum, prop) => sum + prop.availableRooms, 0)}
          color="bg-green-500"
        />
      </div>

      {/* Property Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Listed Properties</h2>
        {properties.length === 0 ? (
          <p className="text-gray-500">No properties listed yet.</p>
        ) : (
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="px-6 py-3 font-medium text-gray-600">Location</th>
                <th className="px-6 py-3 font-medium text-gray-600">Total Rooms</th>
                <th className="px-6 py-3 font-medium text-gray-600">Reserved</th>
                <th className="px-6 py-3 font-medium text-gray-600">Available</th>
                <th className="px-6 py-3 font-medium text-gray-600">Price/Night</th>
                <th className="px-6 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr
                  key={prop.id}
                  className="border-t border-gray-200 hover:bg-gray-50 text-black"
                >
                  <td className="px-6 py-4 font-medium text-indigo-700">{prop.title}</td>
                  <td className="px-6 py-4">{prop.address}</td>
                  <td className="px-6 py-4">{prop.totalRooms}</td>
                  <td className="px-6 py-4">{prop.reservedRooms}</td>
                  <td className="px-6 py-4">{prop.availableRooms}</td>
                  <td className="px-6 py-4">₹ {prop.pricePerNight}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${prop.availableRooms > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                      {prop.availableRooms > 0 ? 'Active' : 'Fully Booked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Card Component
function DashboardCard({ title, count, color }) {
  return (
    <div className={`rounded-xl p-4 shadow text-white ${color}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-3xl font-bold">{count}</h2>
    </div>
  );
}

export default page;
