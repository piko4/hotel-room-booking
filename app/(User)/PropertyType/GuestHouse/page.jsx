"use client"
import PropertyCard from '@/app/Components/PropertyCard';

const page = () => {

  const [properties, setProperties] = useState([]);

  // Change this to dynamically get the type from route or hardcode it
  const propertyType = "GuestHouse"; // or "villa", etc.

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
    <div>
      <PropertyCard properties={properties}/>
    </div>
  )
}

export default page
