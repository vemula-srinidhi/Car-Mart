import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { db, storage, auth } from '../firebase.config';
import './CarDetails.css';

function CarDetails() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error('Car not found');
          navigate('/cars');
        }
      } catch (error) {
        toast.error('Error fetching car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      // Delete images from storage
      await Promise.all(car.images.map(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }));

      // Delete document from Firestore
      await deleteDoc(doc(db, 'cars', id));
      
      toast.success('Car listing deleted successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Error deleting car listing');
    }
  };

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (!car) {
    return <div className="error">Car not found</div>;
  }

  const isOwner = auth.currentUser?.uid === car.userId;

  return (
    <div className="car-details">
      <div className="car-details-container">
        <div className="image-gallery">
          <div className="main-image">
            <img src={car.images[currentImage]} alt={car.title} />
          </div>
          <div className="image-thumbnails">
            {car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${car.title} - ${index + 1}`}
                className={currentImage === index ? 'active' : ''}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="car-info">
          <h1>{car.title}</h1>
          <div className="price">₹{car.price.toLocaleString()}</div>
          
          <div className="tags">
            <span className="tag">{car.carType}</span>
            <span className="tag">{car.company}</span>
            <span className="tag">{car.dealer}</span>
          </div>

          <div className="description">
            <h2>Description</h2>
            <p>{car.description}</p>
          </div>

          {isOwner && (
            <div className="owner-actions">
              <button 
                onClick={() => navigate(`/edit-car/${id}`)}
                className="edit-button"
              >
                Edit Listing
              </button>
              <button 
                onClick={handleDelete}
                className="delete-button"
              >
                Delete Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarDetails;