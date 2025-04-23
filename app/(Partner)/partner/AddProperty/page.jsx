"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const input = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";
const label = "block text-sm font-medium text-gray-700 mb-1";
const section = "space-y-4 bg-white p-6 rounded-xl shadow-sm";
const btn = "px-5 py-2 rounded-lg font-semibold transition-all shadow hover:opacity-90";

const page = () => {
  const [step, setStep] = useState(1);
  const [partner, setPartner] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Hotel",
    pricePerNight: "",
    address: "",
    city: "",
    partnerId: "",
    state: "",
    zipCode: "",
    country: "",
    totalRooms: 1,
    imageUrl: "",
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/PARTNER-SERVICE/auth/partner",
          { withCredentials: true }
        );
        setPartner(response.data);
        setFormData((prev) => ({
          ...prev,
          partnerId: response.data.id, // ✅ Automatically set partnerId
        }));
      } catch (error) {
        console.error("Error fetching partner:", error);
        setPartner(null);
      }
    };

    fetchPartner();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    const data = {
      ...formData,
      reservedRooms: 0,
      availableRooms: formData.totalRooms,
    };

    try {
      await axios.post("http://localhost:8090/RESERVATION-SERVICE/property/add", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      alert("Property added!");
    } catch (err) {
      alert("Submission failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Add New Property (Step {step} of 4)
        </h1>

        {step === 1 && (
          <div className={section}>
            <div>
              <label className={label}>Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className={label}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className={label}>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={input}>
                <option>Hotel</option>
                <option>Villa</option>
                <option>Apartment</option>
              </select>
            </div>
            <div>
              <label className={label}>Price per Night</label>
              <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className={input} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={section}>
            {["address", "city", "state", "zipCode", "country"].map((field) => (
              <div key={field}>
                <label className={label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input name={field} value={formData[field]} onChange={handleChange} className={input} />
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className={section}>
            <label className={label}>Total Rooms</label>
            <input
              type="number"
              name="totalRooms"
              min="1"
              value={formData.totalRooms}
              onChange={handleChange}
              className={input}
            />
          </div>
        )}

        {step === 4 && (
          <div className={section}>
            <label className={label}>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={input}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-4 h-48 rounded-xl object-cover"
              />
            )}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button onClick={prevStep} className={`${btn} bg-gray-300 text-gray-800`}>
              Previous
            </button>
          )}
          {step < 4 && (
            <button onClick={nextStep} className={`${btn} bg-indigo-600 text-white`}>
              Next
            </button>
          )}
          {step === 4 && (
            <button onClick={handleSubmit} className={`${btn} bg-green-600 text-white`}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
