import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import Carousel from '../components/Carousel.jsx';
import About from '../components/About.jsx';

// Landing page, visible to everyone.
export default function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api('/rooms').then((data) => setRooms(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      <Carousel />
      <About />

      <h3 className="mb-3">Rooms preview</h3>
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-3" key={room._id}>
            <div className="card h-100 shadow-sm">
              {room.photos[0] && <img src={room.photos[0]} className="card-img-top" alt={`Room ${room.roomNumber}`} />}
              <div className="card-body">
                <h5>Room {room.roomNumber} <span className="badge bg-secondary">{room.type}</span></h5>
                <p className="mb-1">{room.description}</p>
                <p className="fw-bold mb-0">₹{room.rent} per day</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/rooms" className="btn btn-primary">See all rooms and book</Link>
    </>
  );
}
