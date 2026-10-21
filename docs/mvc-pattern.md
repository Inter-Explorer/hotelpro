# MVC Pattern

The HotelPro backend follows the **Model-View-Controller (MVC)** pattern, which separates an application into three connected layers. This gives modularity, easier maintenance and scalability.

| Layer | Folder | Role |
|---|---|---|
| **Model** | `Server/models/` | Mongoose schemas (User, Room, Booking) and the database operations on them |
| **Controller** | `Server/controllers/` | Receives the request, validates the input, calls the models, returns the response |
| **View (routing layer)** | `Server/Routes/` | Defines the endpoints (GET, POST, PUT, DELETE) and calls the right controller function |

The React application in `Client/` is what the user finally sees; it talks to the routing layer through the API.

## Model layer (data layer)
Handles all data logic: the schemas and the operations on the database. Models use Mongoose, a schema-based solution for MongoDB.

## Controller layer
The go-between for the routes and the models. It receives incoming requests, processes the input (validation or transformation), calls the right model methods and returns a response to the client.

## View layer (routing layer)
In a backend REST API, the view is the routing layer where the endpoints are defined. Each endpoint decides how the backend responds to a request and calls the right controller function.

## Request journey (example: booking a room)
1. The user clicks **Pay and book** in `GetRooms.jsx`, which sends `POST /api/bookings`.
2. **Route:** `Server/Routes/bookingRoutes.js` checks the user is logged in (`protect`) and calls `createBooking`.
3. **Controller:** `createBooking` in `Server/controllers/bookingController.js` validates the dates and card, and checks availability.
4. **Model:** `Server/models/Booking.js` saves the booking in MongoDB.
5. The controller sends the saved booking back as JSON and the React app shows it in My Bookings.

## Advantages of using MVC in this project
- **Separation of concerns:** each layer has one clear job, which improves readability and maintenance
- **Scalability:** new features are added by creating new routes, controllers and models
- **Reusability:** logic in controllers and models can be reused in many places
- **Testing:** each layer can be tested on its own
- **Collaboration:** several developers can work on different layers without conflict
