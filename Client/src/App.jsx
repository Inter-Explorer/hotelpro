import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import UserHome from './pages/UserHome.jsx';
import BookingHistory from './pages/BookingHistory.jsx';
import AdminHome from './pages/AdminHome.jsx';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/rooms" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminHome /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
