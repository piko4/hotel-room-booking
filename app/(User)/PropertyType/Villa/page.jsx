"use client"
import PropertyCard from '@/app/Components/PropertyCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [properties, setProperties] = useState([]);

  // Change this to dynamically get the type from route or hardcode it
  const propertyType = "villa"; // or "villa", etc.

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/RESERVATION-SERVICE/property/type/${propertyType}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, [propertyType]);

  return (
    <div className='"bg-white min-h-screen text-gray-900"' >
      <PropertyCard properties={properties}/>
    </div>
  )
}

export default page
