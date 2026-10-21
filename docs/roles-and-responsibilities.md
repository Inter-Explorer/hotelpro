# Roles and Responsibilities

The project has two types of users: **Customer (ordinary)**, and **Admin**, who takes care of all the users. The roles and responsibilities can be seen from the API endpoints in the code.

## Customer / Ordinary

- Create an account and log in with email and password
- Browse rooms by selecting the arrival and departure dates, and choose the room type wanted
- Pay for the room to complete the booking
- View booking history, and cancel a booking from the booking history page

## Admin

- Manage and monitor the overall booking operation and add rooms to the application
- Monitor all bookings and users: check guests in and out, cancel bookings, view all registered users
- Add, edit and delete rooms
- Enforce platform policies and keep customer data private

## Access summary

| Action | Visitor | Ordinary user | Admin |
|---|---|---|---|
| View rooms, home page | Yes | Yes | Yes |
| Sign up, log in | Yes | Yes | Yes |
| Book and pay for a room | No | Yes | Yes |
| View and cancel own bookings | No | Yes | Yes |
| Add, edit, delete rooms | No | No | Yes |
| View all bookings and users | No | No | Yes |
| Check-in and check-out guests | No | No | Yes |

## How roles are enforced
- `Server/middleware/auth.js` has `protect` (must be logged in) and `adminOnly` (must be admin).
- Signing up as admin needs a secret code from the `.env` file.
- The React app hides admin pages from ordinary users (`ProtectedRoute.jsx`), and the server independently refuses admin requests from them.
