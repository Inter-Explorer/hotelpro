import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import GetRooms from '../components/GetRooms.jsx';

// Dashboard of a logged-in ordinary user.
export default function UserHome() {
  const { user } = useAuth();

  return (
    <>
      <div className="p-4 mb-4 bg-light rounded">
        <h2>Hi, {user.name}</h2>
        <p className="mb-2">Welcome to HotelPro. Choose your dates and find a room.</p>
        <Link to="/my-bookings" className="btn btn-outline-primary btn-sm">View My Bookings</Link>
      </div>
      <GetRooms />
    </>
  );
}
