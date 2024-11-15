import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase.config';
import './Auth.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    const { email, password, confirmPassword, name } = formData;
    
    if (password !== confirmPassword) {
       toast.error('Passwords do not match');
       setLoading(false);
       return;
    }
 
    try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 
       await updateProfile(userCredential.user, { displayName: name });
 
       await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
       });
 
       toast.success('Account created successfully!');
       navigate('/');
    } catch (error) {
      console.log('error',error)
       if (error.code === 'auth/email-already-in-use') {
          toast.error('This email is already in use.');
       } else if (error.code === 'auth/weak-password') {
          toast.error('Password should be at least 6 characters.');
       } else {
          toast.error('Failed to create account. Please try again.');
       }
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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join Nidhi Car Mart today</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;