import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminBookings from '../components/AdminBookings.jsx';
import AdminRooms from '../components/AdminRooms.jsx';
import RoomForm from '../components/RoomForm.jsx';
import AdminUsers from '../components/AdminUsers.jsx';

const tabs = [
  { id: 'bookings', label: 'All Bookings' },
  { id: 'rooms', label: 'All Rooms' },
  { id: 'add', label: 'Add Room' },
  { id: 'users', label: 'All Users' },
];

// Admin dashboard with four tabs.
export default function AdminHome() {
  const { user } = useAuth();
  const [tab, setTab] = useState('bookings');
  const [roomsVersion, setRoomsVersion] = useState(0); // changes when a room is added, so the list reloads

  return (
    <>
      <h2 className="mb-3">Admin Dashboard <small className="text-muted fs-6">Hi, {user.name}</small></h2>
      <ul className="nav nav-tabs mb-4">
        {tabs.map((t) => (
          <li className="nav-item" key={t.id}>
            <button className={`nav-link ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'bookings' && <AdminBookings />}
      {tab === 'rooms' && <AdminRooms key={roomsVersion} />}
      {tab === 'add' && (
        <RoomForm onSaved={() => { setRoomsVersion((v) => v + 1); setTab('rooms'); }} />
      )}
      {tab === 'users' && <AdminUsers />}
    </>
  );
}
