import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { db, storage, auth } from '../firebase.config';
import './EditCar.css';

function EditCar() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    carType: '',
    company: '',
    dealer: '',
    price: '',
  });
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const carData = docSnap.data();
          if (carData.userId !== auth.currentUser?.uid) {
            toast.error('You are not authorized to edit this listing');
            navigate('/profile');
            return;
          }
          setFormData({
            title: carData.title,
            description: carData.description,
            carType: carData.carType,
            company: carData.company,
            dealer: carData.dealer,
            price: carData.price,
          });
          setCurrentImages(carData.images);
        } else {
          toast.error('Car not found');
          navigate('/profile');
        }
      } catch (error) {
        toast.error('Error fetching car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (currentImages.length + files.length - imagesToDelete.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setNewImages(files);
  };

  const handleRemoveImage = (imageUrl) => {
    setCurrentImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const uploadNewImages = async () => {
    const urls = [];
    for (const image of newImages) {
      const fileName = `${auth.currentUser.uid}/${uuidv4()}`;
      const imageRef = ref(storage, fileName);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  };

  const deleteOldImages = async () => {
    for (const imageUrl of imagesToDelete) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newImageUrls = await uploadNewImages();
      await deleteOldImages();
      
      const updatedImages = [
        ...currentImages.filter(img => !imagesToDelete.includes(img)),
        ...newImageUrls
      ];

      await updateDoc(doc(db, 'cars', id), {
        ...formData,
        images: updatedImages,
      });

      toast.success('Car listing updated successfully!');
      navigate(`/car/${id}`);
    } catch (error) {
      toast.error('Failed to update car listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-car-container">
      <div className="edit-car-card">
        <h2>Edit Car Listing</h2>
        <form onSubmit={handleSubmit} className="edit-car-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carType">Car Type</label>
              <input
                type="text"
                id="carType"
                value={formData.carType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dealer">Dealer</label>
              <input
                type="text"
                id="dealer"
                value={formData.dealer}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="current-images">
            <h3>Current Images</h3>
            <div className="image-grid">
              {currentImages.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Car ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="images">Add New Images</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <small>Total images cannot exceed 10</small>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCar;