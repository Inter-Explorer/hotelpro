# Features

## User Features

**User Authentication**
- Sign up with name, email, password, phone number and user type
- Login with email and password
- Password validation and confirm-password check
- Session handling with JWT for secure access

**User Dashboard (UserHome)**
- Personalised welcome message (Hi, user name)
- Navigation to the My Bookings page
- Logout

**Room Browsing**
- View all available rooms with images and details
- Search by arrival date, departure date, number of people and room type
- Information about room type, rent and capacity

**Booking Management**
- Book a room and pay (simulated payment)
- View booking history with room type, booking ID, dates, total amount, phone and status
- Cancel a booking while it is still active

**Responsive UI**
- Home page carousel with room highlights
- About section
- Mobile-friendly navbar and layout (Bootstrap)

## Admin Features

**Admin Dashboard (AdminHome)** with tabs:
- **All Bookings:** view every booking, check guests in and out, cancel bookings
- **All Rooms:** see all rooms, edit or delete them
- **Add Room:** add a new room (number, capacity, rent, type, description, images)
- **All Users:** view all registered users

**Admin Authentication**
- Secure login with email and password
- JWT-based session
- Greeting with the admin's name
- Admin signup needs a secret admin code, so customers cannot make themselves admin

**System**
- Double-booking prevention using a date-overlap check
- Role-based access control (ordinary user and admin)
- Central error handling with clear messages
