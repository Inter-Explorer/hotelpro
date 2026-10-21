import { useEffect, useState } from 'react';
import { api } from '../api.js';

const badge = {
  booked: 'primary',
  'checked-in': 'success',
  'checked-out': 'secondary',
  cancelled: 'danger',
};

const fmt = (d) => new Date(d).toLocaleDateString();

// "My Bookings": all bookings of the logged-in user.
export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setBookings(await api('/bookings/my'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    setError('');
    try {
      await api(`/bookings/${id}/cancel`, { method: 'PUT' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2 className="mb-3">My Bookings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {bookings.length === 0 && <p>You have no bookings yet.</p>}

      {bookings.map((b) => (
        <div className="card mb-3" key={b._id}>
          <div className="card-body d-flex justify-content-between flex-wrap">
            <div>
              <h5>{b.type} Room {b.roomid?.roomNumber}</h5>
              <p className="mb-1"><small className="text-muted">Booking ID: {b._id}</small></p>
              <p className="mb-1">From {fmt(b.fromdate)} to {fmt(b.todate)} ({b.totaldays} nights)</p>
              <p className="mb-1">Total amount: <strong>₹{b.totalAmount}</strong> · Phone: {b.phone}</p>
              <span className={`badge bg-${badge[b.status]}`}>{b.status === 'booked' ? 'Active' : b.status}</span>
            </div>
            <div>
              {b.status === 'booked' && (
                <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(b._id)}>Cancel booking</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
