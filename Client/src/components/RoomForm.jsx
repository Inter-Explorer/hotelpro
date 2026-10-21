import { useState } from 'react';
import { api } from '../api.js';

// Form used to ADD a room (no "room" prop) or to EDIT one (pass the room).
export default function RoomForm({ room, onSaved, onCancel }) {
  const [form, setForm] = useState({
    roomNumber: room?.roomNumber || '',
    count: room?.count || '',
    rent: room?.rent || '',
    type: room?.type || 'Delux',
    description: room?.description || '',
    photo1: room?.photos?.[0] || '',
    photo2: room?.photos?.[1] || '',
    photo3: room?.photos?.[2] || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const body = {
      roomNumber: form.roomNumber,
      count: form.count,
      rent: form.rent,
      type: form.type,
      description: form.description,
      photos: [form.photo1, form.photo2, form.photo3],
    };
    try {
      if (room) await api(`/rooms/${room._id}`, { method: 'PUT', body });
      else await api('/rooms', { method: 'POST', body });
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card card-body mb-3" onSubmit={handleSubmit}>
      <h5>{room ? `Edit Room ${room.roomNumber}` : 'Add a New Room'}</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-2">
        <div className="col-md-4">
          <label className="form-label">Room Number</label>
          <input className="form-control" name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Max Count (number of people)</label>
          <input className="form-control" type="number" min="1" name="count" value={form.count} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Room Rent (per day)</label>
          <input className="form-control" type="number" min="0" name="rent" value={form.rent} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Room Type</label>
          <select className="form-select" name="type" value={form.type} onChange={handleChange}>
            <option>Delux</option>
            <option>Non-Delux</option>
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label">Room Description</label>
          <input className="form-control" name="description" value={form.description} onChange={handleChange} required />
        </div>
        {['photo1', 'photo2', 'photo3'].map((key, i) => (
          <div className="col-md-4" key={key}>
            <label className="form-label">Image URL {i + 1}</label>
            <input className="form-control" name={key} value={form[key]} onChange={handleChange} placeholder="https://..." />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button className="btn btn-primary me-2">{room ? 'Update room' : 'Add room'}</button>
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
