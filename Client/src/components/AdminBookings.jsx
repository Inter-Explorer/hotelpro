import { useEffect, useState } from 'react';
import { api } from '../api.js';

const fmt = (d) => new Date(d).toLocaleDateString();

// "All Bookings" tab: every booking, with check-in / check-out / cancel.
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setBookings(await api('/bookings'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action, body) => {
    setError('');
    try {
      await api(`/bookings/${id}/${action}`, { method: 'PUT', body });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Booking ID</th><th>Guest</th><th>Room</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><small>{b._id}</small></td>
                <td>{b.username}<br /><small className="text-muted">{b.phone}</small></td>
                <td>{b.roomid?.roomNumber} ({b.type})</td>
                <td>{fmt(b.fromdate)} to {fmt(b.todate)}</td>
                <td>₹{b.totalAmount}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === 'booked' && (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={() => act(b._id, 'status', { status: 'checked-in' })}>Check-in</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => act(b._id, 'cancel')}>Cancel</button>
                    </>
                  )}
                  {b.status === 'checked-in' && (
                    <button className="btn btn-sm btn-secondary" onClick={() => act(b._id, 'status', { status: 'checked-out' })}>Check-out</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && <p>No bookings yet.</p>}
    </>
  );
}
