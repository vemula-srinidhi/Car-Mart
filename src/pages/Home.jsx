import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Nidhi Car Mart</h1>
          <p className="hero-subtitle">Discover Your Perfect Drive</p>
          <div className="hero-cta">
            {user ? (
              <Link to="/add-car" className="cta-button">List Your Car</Link>
            ) : (
              <Link to="/login" className="cta-button">Get Started</Link>
            )}
            <Link to="/cars" className="cta-button secondary">Browse Cars</Link>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Wide Selection</h3>
            <p>Browse through our extensive collection of premium vehicles</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find your dream car with our powerful search tools</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Quality Assured</h3>
            <p>All cars are verified for quality and authenticity</p>
          </div>
        </div>
      </section>
      <section className="brands-section">
        <h2>Popular Brands</h2>
        <div className="brands-grid">
          {['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford'].map((brand) => (
            <div key={brand} className="brand-card">
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;