"use client"
import PropertyCard from '@/app/Components/PropertyCard';
import axios from 'axios';
import { useEffect, useState } from 'react';

const page = () => {

  const [properties, setProperties] = useState([]);

  // Change this to dynamically get the type from route or hardcode it
  const propertyType = "apartment"; // or "villa", etc.

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get( `http://localhost:8090/RESERVATION-SERVICE/property/type/${propertyType}`);
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, [propertyType]);


  return (
    <div>
      <PropertyCard properties={properties} />
    </div>
  )
}

export default page
