import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { db, storage, auth } from '../firebase.config';
import './AddCar.css';

function AddCar() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    carType: '',
    company: '',
    dealer: '',
    price: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages(files);
  };

  const uploadImages = async () => {
    const urls = [];
    for (const image of images) {
      try {
        const fileName = `${auth.currentUser.uid}/${uuidv4()}`;
        const imageRef = ref(storage, fileName);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      } catch (error) {
        console.error("Image upload error:", error); // Logs specific error
        toast.error("Failed to upload image. Please try again.");
        throw error; // Re-throw to handle at a higher level
      }
    }
    return urls;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();
      
      await addDoc(collection(db, 'cars'), {
        ...formData,
        images: imageUrls,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success('Car listed successfully!');
      navigate('/profile');
    } catch (error) {
      console.log('console:erro',error)
      toast.error('Failed to list car. Please try again.');
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

  return (
    <div className="add-car-container">
      <div className="add-car-card">
        <h2>List Your Car</h2>
        <form onSubmit={handleSubmit} className="add-car-form">
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

          <div className="form-group">
            <label htmlFor="images">Images (Max 10)</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Listing Car...' : 'List Car'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCar;