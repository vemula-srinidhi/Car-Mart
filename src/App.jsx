import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import CarList from './pages/CarList';
import CarDetails from './pages/CarDetails';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cars" element={<PrivateRoute><CarList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/add-car" element={<PrivateRoute><AddCar /></PrivateRoute>} />
          <Route path="/edit-car/:id" element={<PrivateRoute><EditCar /></PrivateRoute>} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;