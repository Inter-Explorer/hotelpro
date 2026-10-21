import { useEffect, useState } from 'react';

// Simple home page carousel (slides change automatically every 4 seconds).
const slides = [
  { title: 'Welcome to HotelPro', text: 'Comfortable rooms at honest prices.', color: '#0d6efd' },
  { title: 'Book in seconds', text: 'Pick your dates, choose a room and confirm.', color: '#198754' },
  { title: 'Delux and Non-Delux rooms', text: 'Something for every budget.', color: '#6f42c1' },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(timer); // cleanup when the page closes
  }, []);

  const slide = slides[index];

  return (
    <div className="rounded text-white text-center p-5" style={{ background: slide.color, minHeight: 220 }}>
      <h1 className="display-5 fw-bold">{slide.title}</h1>
      <p className="lead">{slide.text}</p>
      <div>
        {slides.map((s, i) => (
          <button
            key={s.title}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className="btn btn-sm rounded-circle me-1"
            style={{ width: 12, height: 12, padding: 0, background: i === index ? '#fff' : 'rgba(255,255,255,.5)' }}
          />
        ))}
      </div>
    </div>
  );
}
