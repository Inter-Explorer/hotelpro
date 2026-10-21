import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand navbar-dark" style={{ background: 'linear-gradient(90deg, #212529, #0d6efd)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">HotelPro</Link>
        <div className="navbar-nav ms-auto align-items-center">
          <Link className="nav-link" to="/">Home</Link>

          {/* Visitor */}
          {!user && (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/signup">SignUp</Link>
            </>
          )}

          {/* Ordinary user */}
          {user?.userType === 'ordinary' && (
            <>
              <Link className="nav-link" to="/rooms">Rooms</Link>
              <Link className="nav-link" to="/my-bookings">My Bookings</Link>
            </>
          )}

          {/* Admin */}
          {user?.userType === 'admin' && <Link className="nav-link" to="/admin">Admin Dashboard</Link>}

          {user && (
            <>
              <span className="navbar-text mx-2">Hi, {user.name}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
