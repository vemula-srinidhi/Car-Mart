import { Link } from 'react-router-dom';
import './CarCard.css';

function CarCard({ car }) {
  return (
    <Link to={`/car/${car.id}`} className="car-card">
      <div className="car-image-container">
        <img 
          src={car.images[0]} 
          alt={car.title} 
          className="car-image"
        />
        <div className="car-price">₹{car.price.toLocaleString()}</div>
      </div>
      <div className="car-content">
        <h3 className="car-title">{car.title}</h3>
        <p className="car-description">
          {car.description.length > 100 
            ? `${car.description.substring(0, 100)}...` 
            : car.description}
        </p>
        <div className="car-tags">
          <span className="tag">{car.carType}</span>
          <span className="tag">{car.company}</span>
          <span className="tag">{car.dealer}</span>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;