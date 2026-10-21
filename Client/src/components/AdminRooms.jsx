import { useEffect, useState } from 'react';
import { api } from '../api.js';
import RoomForm from './RoomForm.jsx';

// "All Rooms" tab: list of rooms with edit and delete.
export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null); // the room being edited
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setRooms(await api('/rooms'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    setError('');
    try {
      await api(`/rooms/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}

      {editing && (
        <RoomForm
          key={editing._id}
          room={editing}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr><th>No.</th><th>Type</th><th>Rent</th><th>Capacity</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id}>
                <td>{r.roomNumber}</td>
                <td>{r.type}</td>
                <td>₹{r.rent}</td>
                <td>{r.count}</td>
                <td>{r.description}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditing(r)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
