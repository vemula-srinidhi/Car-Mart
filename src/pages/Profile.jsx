import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import CarCard from '../components/CarCard';
import './Profile.css';

function Profile() {
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const q = query(
          collection(db, 'cars'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const cars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUserCars(cars);
      } catch (error) {
        console.error('Error fetching user cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
  }, []);

  if (loading) {
    return <div className="loading">Loading your listings...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-info">
          <h1>My Profile</h1>
          <p>{auth.currentUser.email}</p>
        </div>
        <Link to="/add-car" className="add-car-button">
          Add New Car
        </Link>
      </div>

      <div className="profile-content">
        <h2>My Listings</h2>
        {userCars.length > 0 ? (
          <div className="user-cars-grid">
            {userCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="no-cars">
            <p>You haven't listed any cars yet.</p>
            <Link to="/add-car" className="start-listing-button">
              Start Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;