import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const emptyCard = { cardholdername: '', cardnumber: '', expmonthyear: '', cvvcode: '' };
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Search rooms by dates, then book and pay for one.
export default function GetRooms() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  const [search, setSearch] = useState({ fromdate: '', todate: '', guests: 1, type: '' });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // the room being booked
  const [card, setCard] = useState(emptyCard);

  const loadRooms = async (params) => {
    setLoading(true);
    setError('');
    try {
      // Build "?fromdate=...&guests=..." but skip empty values
      const query = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null)
      ).toString();
      setRooms(await api(`/rooms?${query}`));
    } catch (err) {
      setError(err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Runs once when the page opens: show all rooms.
  useEffect(() => {
    loadRooms({});
  }, []);

  const handleChange = (e) => setSearch({ ...search, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setCard({ ...card, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    setSelected(null);
    loadRooms(search);
  };

  const startBooking = (room) => {
    if (!search.fromdate || !search.todate) {
      return setError('Please choose arrival and departure dates, then search, before booking.');
    }
    setError('');
    setSelected(room);
  };

  const nights = search.fromdate && search.todate
    ? Math.ceil((new Date(search.todate) - new Date(search.fromdate)) / MS_PER_DAY)
    : 0;

  // Pay and book in one step
  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api('/bookings', {
        method: 'POST',
        body: {
          roomId: selected._id,
          fromdate: search.fromdate,
          todate: search.todate,
          guests: search.guests,
          cardDetails: card,
        },
      });
      alert('Payment successful. Your room is booked.');
      navigate('/my-bookings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-3">
          <label className="form-label">Arrival date</label>
          <input type="date" name="fromdate" min={today} className="form-control"
            value={search.fromdate} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Departure date</label>
          <input type="date" name="todate" min={search.fromdate || today} className="form-control"
            value={search.todate} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label className="form-label">People</label>
          <input type="number" name="guests" min="1" className="form-control"
            value={search.guests} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label className="form-label">Room type</label>
          <select name="type" className="form-select" value={search.type} onChange={handleChange}>
            <option value="">Any</option>
            <option>Delux</option>
            <option>Non-Delux</option>
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Payment form for the selected room */}
      {selected && (
        <form className="card card-body mb-4 border-success" onSubmit={handlePay}>
          <h5>Pay for Room {selected.roomNumber} ({selected.type})</h5>
          <p className="mb-2">
            {nights} night(s) × ₹{selected.rent} = <strong>₹{nights * selected.rent}</strong>
          </p>
          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" name="cardholdername" placeholder="Cardholder name"
                value={card.cardholdername} onChange={handleCardChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="cardnumber" placeholder="Card number (16 digits)"
                inputMode="numeric" maxLength={19} value={card.cardnumber} onChange={handleCardChange} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" name="expmonthyear" placeholder="MM/YY"
                maxLength={5} value={card.expmonthyear} onChange={handleCardChange} required />
            </div>
            <div className="col-md-1">
              <input className="form-control" name="cvvcode" placeholder="CVV" type="password"
                maxLength={4} value={card.cvvcode} onChange={handleCardChange} required />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100">Pay and book</button>
            </div>
          </div>
          <small className="text-muted mt-2">
            Demo payment only: no money is charged. The CVV is never saved, and only the last 4 card digits are kept.
          </small>
          <button type="button" className="btn btn-link p-0 mt-1 align-self-start" onClick={() => setSelected(null)}>
            Cancel
          </button>
        </form>
      )}

      {loading && <p>Loading rooms...</p>}
      {!loading && rooms.length === 0 && !error && <p>No rooms available for these choices.</p>}

      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-4" key={room._id}>
            <div className="card h-100 shadow-sm">
              {room.photos[0] && <img src={room.photos[0]} className="card-img-top" alt={`Room ${room.roomNumber}`} />}
              <div className="card-body">
                <h5 className="card-title">Room {room.roomNumber} <span className="badge bg-secondary">{room.type}</span></h5>
                <p className="card-text">{room.description}</p>
                <p className="mb-1">Room capacity: {room.count} people</p>
                <p className="fw-bold">Rent: ₹{room.rent} per day</p>
                <button className="btn btn-success" onClick={() => startBooking(room)}>Book now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
