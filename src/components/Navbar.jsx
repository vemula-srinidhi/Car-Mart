import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Assuming you're using a custom hook for user data
import { signOut } from 'firebase/auth';  // Firebase signOut method
import { auth } from '../firebase.config';  // Firebase config file
import './Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();  // React Router navigate hook

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Log the user out
      navigate('/');  // Navigate to the home page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Nidhi Car Mart
        </Link>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/cars" className="nav-link" onClick={() => setMenuOpen(false)}>Cars</Link>
          {user ? (
            <>
              <Link to="/add-car" className="nav-link" onClick={() => setMenuOpen(false)}>Add Car</Link>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="nav-link" onClick={handleLogout}>Logout</button> {/* Logout button */}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="nav-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
