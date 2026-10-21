# HotelPro - Hotel Booking and Management System

A full-stack MERN application (MongoDB, Express, React, Node.js) for booking and managing hotel rooms.

## Features
- Sign up and login with JWT authentication (passwords hashed with bcrypt)
- Two user types: ordinary (customer) and admin
- Search rooms by dates, people and type (only free rooms are shown)
- Double-booking prevention using a date-overlap check
- Book and pay (simulated payment), view booking history, cancel bookings
- Admin dashboard: All Bookings (check-in, check-out, cancel), All Rooms (edit, delete), Add Room, All Users

## Tech stack
React (Vite), React Router, Axios, Bootstrap, Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, nodemon

## Project structure
```
hotelpro/
  Client/   React (Vite) frontend
  Server/   Express + MongoDB backend
    models/        data schemas (User, Room, Booking)
    controllers/   request logic
    Routes/        URL to controller mapping
    middleware/    login and admin checks
    utils/         helpers (availability check, errors)
  docs/     architecture documents
```

## Steps for project execution

You need Node.js and MongoDB installed on your computer (or a MongoDB Atlas link).

### Step 1: Server (backend)
```
cd Server
npm install
```
Create a file named `.env` inside `Server` (copy `env.example` and rename it), and fill in:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotel
JWT_SECRET=any_long_random_text
ADMIN_CODE=any_secret_code
```
Then create the admin account and sample rooms, and start the server:
```
npm run seed
npm run dev
```
The server runs at http://localhost:5000

### Step 2: Client (frontend), in a second terminal
```
cd Client
npm install
npm run dev
```
The app runs at http://localhost:5173

### Admin login (created by the seed script)
Email: admin@hotelpro.com  Password: Admin@123  (change it after first use)

## API summary
| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Create account |
| POST | /api/auth/login | public | Login, returns token |
| GET | /api/auth/users | admin | All users |
| GET | /api/rooms | public | List rooms (filter by dates, people, type) |
| POST/PUT/DELETE | /api/rooms | admin | Manage rooms |
| POST | /api/bookings | user | Book and pay for a room |
| GET | /api/bookings/my | user | My bookings |
| PUT | /api/bookings/:id/cancel | owner/admin | Cancel |
| GET | /api/bookings | admin | All bookings |
| PUT | /api/bookings/:id/status | admin | Check-in / check-out |

## Documentation
- [Technical architecture](docs/technical-architecture.md)
- [ER diagram](docs/er-diagram.md)
- [Features](docs/features.md)
- [Roles and responsibilities](docs/roles-and-responsibilities.md)
- [User flow](docs/user-flow.md)
- [MVC pattern](docs/mvc-pattern.md)
- [Output screenshots](docs/screenshots/README.md)

## Limitations
- Payment is simulated: no money is charged, the CVV is never stored and only the last four card digits are kept.
- Two users booking the same room at the exact same instant could in theory both pass the check; production systems solve this with database transactions.
