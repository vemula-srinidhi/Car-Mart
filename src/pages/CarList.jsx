import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import CarCard from '../components/CarCard';
import SearchBar from '../components/SearchBar';
import './CarList.css';

function CarList() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsQuery = query(collection(db, 'cars'));
        const querySnapshot = await getDocs(carsQuery);
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = cars.filter(car => {
      const searchString = searchTerm.toLowerCase();
      return (
        car.title.toLowerCase().includes(searchString) ||
        car.description.toLowerCase().includes(searchString) ||
        car.carType.toLowerCase().includes(searchString) ||
        car.company.toLowerCase().includes(searchString) ||
        car.dealer.toLowerCase().includes(searchString)
      );
    });
    setFilteredCars(filtered);
  };

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  return (
    <div className="car-list-container">
      <SearchBar onSearch={handleSearch} />
      <div className="car-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))
        ) : (
          <div className="no-results">No cars found matching your search.</div>
        )}
      </div>
    </div>
  );
}

export default CarList;