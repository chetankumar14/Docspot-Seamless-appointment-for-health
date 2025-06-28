# Docspot-Seamless-appointment-for-health
In This Repository i had for my DOCSPOT project for SmartBridege Internship

Docspot Application: A Comprehensive Explanation
The Docspot application is a web-based platform designed to facilitate interactions between customers, doctors, and an administrator for managing medical appointments and doctor profiles. It follows a typical client-server architecture, where a frontend (what users see and interact with in their browser) communicates with a backend (the server-side logic and database).

Architectural Overview
Frontend (Client-Side): Built with React and Vite. This is the user interface that runs in the web browser. It handles displaying information, user input, and making requests to the backend.

Backend (Server-Side): Built with Node.js and Express.js. This is the core application logic, responsible for handling API requests, interacting with the database, performing authentication/authorization, and processing data.

Database: MongoDB (a NoSQL database) is used to store all application data, accessed through Mongoose.js (an Object Data Modeling library for Node.js).

Backend Deep Dive (Server)
The backend is the brain of your application. It acts as an API (Application Programming Interface), providing a set of rules and protocols for how other applications (like your frontend) can interact with it to access or modify data.

Technologies Used:

Node.js: JavaScript runtime environment that allows you to run JavaScript code outside a web browser.

Express.js: A fast, unopinionated, minimalist web framework for Node.js, used to build robust APIs.

MongoDB: A NoSQL, document-oriented database that stores data in flexible, JSON-like documents.

Mongoose.js: An ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a schema-based solution to model your application data and provides methods for interacting with MongoDB.

JSON Web Tokens (JWT): A compact, URL-safe means of representing claims to be transferred between two parties. Used for user authentication and authorization.

Bcrypt.js: A library used to hash passwords, ensuring they are stored securely in the database (never in plain text).

CORS (Cross-Origin Resource Sharing): A mechanism that allows resources on a web page to be requested from another domain outside the domain from which the first resource was served. Essential for frontend-backend communication when they are on different ports/domains.

Dotenv: A module to load environment variables from a .env file into process.env.

Backend Folder Structure & Responsibilities:

index.js (or server.js):

Purpose: This is the main entry point of your backend application.

Role:

Initializes the Express application.

Loads environment variables (.env).

Connects to the MongoDB database using config/db.js.

Configures global middleware (like cors and express.json() for parsing JSON requests).

Mounts all your API routes (from the routes/ folder) to specific base paths (e.g., /api/auth).

Starts the Express server, making it listen for incoming requests on a defined port (8080).

config/:

Purpose: Contains configuration files for your application.

Role: db.js specifically handles the connection to your MongoDB database. It abstracts away the database connection string and connection logic, making it reusable and easy to manage. When index.js starts, it calls connectDB() to establish this connection.

models/:

Purpose: Defines the data structures (schemas) for your MongoDB collections.

Role: Each file here (e.g., User.js, DoctorProfile.js, Appointment.js) defines a Mongoose schema, which specifies:

The fields that each document in a collection will have.

The data type for each field (String, Number, Date, ObjectId, etc.).

Validation rules (e.g., required: true, unique: true, min, max).

Relationships between different collections (e.g., userId in DoctorProfile references User).

Middleware (like pre('save') hooks in User.js to hash passwords before saving).

Custom methods (like matchPassword in User.js for password comparison).

middleware/:

Purpose: Contains functions that execute between an incoming request and the final route handler. They can perform checks, modify the request/response, or terminate the cycle.

Role: authMiddleware.js is crucial for security:

protect: This middleware intercepts requests to protected routes. It extracts the JWT token from the Authorization header, verifies it, and if valid, attaches the authenticated user's details (req.user) to the request object. If the token is missing or invalid, it sends a 401 Unauthorized response.

admin / doctor: These are authorization middlewares. After protect has identified the user, these middlewares check the req.user.role to ensure only users with the 'admin' or 'doctor' role, respectively, can access specific routes. If not authorized, they send a 403 Forbidden response.

controllers/:

Purpose: Houses the business logic that handles requests for specific API endpoints.

Role: Each file (e.g., authController.js, doctorController.js, appointmentController.js) contains functions that are called by the routes. These functions:

Extract data from the incoming req object (req.body, req.params, req.query).

Interact with Mongoose models to query, create, update, or delete data in MongoDB.

Implement core application logic (e.g., registering a user, checking credentials, booking an appointment, approving a doctor).

Construct appropriate responses (res.json(), res.status()) to send back to the frontend.

Include try...catch blocks for error handling and logging to the backend terminal.

routes/:

Purpose: Defines the API endpoints and maps them to specific controller functions and middleware.

Role: Each file (e.g., authRoutes.js, doctorRoutes.js, appointmentRoutes.js, userRoutes.js) uses express.Router() to group related routes. They specify:

The URL path (e.g., /register, /profile).

The HTTP method (e.g., router.post(), router.get(), router.put()).

Any middleware that should run before the controller (e.g., protect, admin, doctor).

The controller function that handles the request.

This layer acts as the initial dispatcher, directing incoming requests to the correct logic.

.env (Backend):

Purpose: Stores sensitive or environment-specific configuration variables for the backend.

Role: Contains your PORT number (where the server listens), MONGO_URI (your MongoDB connection string), and JWT_SECRET (a secret key used for signing/verifying JWTs). These are loaded into process.env by the dotenv module in index.js.

Frontend Deep Dive (Client)
The frontend is what the user sees and interacts with. It presents the data from the backend in a user-friendly way and collects user input to send back to the server.

Technologies Used:

React: A JavaScript library for building user interfaces, focused on declarative components.

Vite: A fast build tool that provides a lightning-fast development server and optimized builds for production.

React Router: A library for declarative routing in React applications, allowing navigation between different views.

Redux (with Redux Toolkit and React-Redux): A state management library used for managing the global state of the application in a predictable way.

Redux Toolkit: Simplifies Redux development with opinionated best practices.

React-Redux: Provides bindings to connect React components to a Redux store.

Axios: A promise-based HTTP client for the browser and Node.js, used to make API calls to the backend.

React-Bootstrap / MDB-React-UI-Kit / Font Awesome: UI libraries and icon sets for styling and pre-built components.

Frontend Folder Structure & Responsibilities:

main.jsx:

Purpose: The main entry point of your React application.

Role:

Uses ReactDOM.createRoot to render your main App component into the HTML root element (<div id="root">).

Wraps the App with necessary providers:

Provider (from react-redux): Makes the Redux store (defined in redux/store.js) available to all components throughout the application.

BrowserRouter (from react-router-dom): Enables client-side routing.

Imports global CSS files (like Bootstrap).

.env (Frontend):

Purpose: Stores environment-specific variables for the frontend.

Role: Typically contains the base URL of your backend API (e.g., VITE_API_BASE_URL=http://localhost:8080/api). Vite automatically exposes variables starting with VITE_ to the client-side code.

components/:

Purpose: Contains small, reusable, and self-contained UI components.

Role: These are the building blocks. Examples include:

Auth/Login.jsx, Auth/Register.jsx: Forms for user authentication.

Could include Header.jsx, Footer.jsx, generic buttons, input fields, etc.

They typically receive data via props and emit events (e.g., onClick, onChange) to parent components.

pages/:

Purpose: Represents major "screens" or views of your application.

Role: These components combine multiple smaller components from components/ to form a complete page layout. They often handle data fetching specific to that page and manage the local state for that page.

Examples: LoginPage.jsx, RegisterPage.jsx, Customer/CustomerDashboardPage.jsx, Doctor/DoctorDashboardPage.jsx, Admin/AdminDashboardPage.jsx.

redux/:

Purpose: Manages the global state of your application using Redux.

Role:

store.js: Configures the Redux store, bringing together all your state "slices."

slices/ (e.g., authSlice.js, doctorSlice.js, appointmentSlice.js): Each slice is a piece of your global state.

Defines the initialState (what the state looks like initially).

Defines reducers (functions that specify how the state changes in response to actions).

Defines actions (functions that you "dispatch" to trigger state changes).

Components use useSelector to read data from the store and useDispatch to dispatch actions to update the store.

authSlice.js is critical for storing user information (like userInfo and token) after login/registration.

routes/:

Purpose: Handles client-side navigation and route protection.

Role:

AppRoutes.jsx: Defines all the routes in your application using react-router-dom's <Routes> and <Route> components. It maps specific URL paths (e.g., /login, /customer-dashboard) to the components that should be rendered.

PrivateRoute.jsx: A custom component that acts as a guard. It checks if a user is authenticated and, in some cases, if they have a specific role (admin, doctor). If the conditions are not met, it redirects the user to a login page or another appropriate route.

services/:

Purpose: Centralizes the logic for making API calls to your backend.

Role: api.js creates an axios instance configured with your backend's base URL (http://localhost:8080/api). It also includes an interceptor that automatically attaches the JWT token (from localStorage or Redux state) to the Authorization header of every outgoing request. This is essential for authenticated routes on the backend.

views/:

Purpose: Contains layout components that define the overall structure for different sections of the application.

Role: Layout.jsx provides a consistent navigation bar, potentially a footer, and acts as a wrapper for pages. It uses Outlet from react-router-dom to render the content of the currently matched route within its layout.

How Frontend and Backend Interact: The Flow
Let's trace some key flows:

User Registration (Register.jsx -> authController.js):

Frontend: The user fills out the registration form (name, username, email, password) in Register.jsx. When they submit, handleRegister makes an axios.post request via api.js to http://localhost:8080/api/auth/register with the form data in the request body.

Backend:

index.js receives the POST request.

authRoutes.js maps /api/auth/register to the registerUser function in authController.js.

authController.js:

Receives name, username, email, password from req.body.

Checks if email or username already exist in the users collection (using User.findOne()).

Determines the role (customer or doctor) and isApproved status based on the email (e.g., @doctor.com -> role: 'doctor', isApproved: false).

The User model's pre('save') hook hashes the password before saving.

Creates a new User document in MongoDB (User.create()).

Crucially: If the new user is a doctor, it also creates an empty DoctorProfile document in the doctorprofiles collection (using DoctorProfile.create()) with userId linking to the new user's _id and default values for required fields.

Generates a JWT token for the new user using jsonwebtoken.

Sends a 201 Created response back to the frontend with the user's details and the JWT token.

Frontend: Register.jsx receives the successful response. It displays a success message, clears the form, and redirects the user to the login page after a short delay.

User Login (Login.jsx -> authController.js):

Frontend: User enters email and password. handleLogin dispatches login action. api.js sends axios.post to http://localhost:8080/api/auth/login.

Backend:

index.js receives the POST request.

authRoutes.js maps to loginUser in authController.js.

authController.js:

Finds the user by email (User.findOne()).

Uses user.matchPassword() (a method on the User model that uses bcrypt.compare) to compare the provided plain-text password with the stored hashed password.

If credentials are valid, and if the user is a doctor, it checks if isApproved is true. If not, it sends a 403 Forbidden error (forcing them to wait for admin approval).

Generates a new JWT token.

Sends a 200 OK response with user details (including _id, name, username, email, role, isApproved, token).

Frontend: Login.jsx receives the response. If successful:

It dispatches setCredentials action to authSlice.js.

authSlice.js updates the Redux userInfo state and saves userInfo (including the token) to localStorage.

The user is redirected to their respective dashboard (/customer-dashboard, /doctor-dashboard, or /admin-dashboard) based on their role.

Accessing Protected Dashboards (PrivateRoute.jsx):

Frontend: When the user tries to navigate to a dashboard (e.g., /doctor-dashboard), AppRoutes.jsx renders PrivateRoute.

PrivateRoute.jsx:

Checks userInfo in Redux state (which was loaded from localStorage by authSlice).

If userInfo exists (meaning the user is logged in), it checks their role and isApproved status against the required roles for that route.

If authorized, it renders the intended component (DoctorDashboardPage.jsx).

If unauthorized (e.g., doctor not approved, or trying to access admin dashboard as a customer), it redirects them to /login or the appropriate dashboard (/customer-dashboard for unapproved doctors).

Customer Booking Appointment (CustomerDashboardPage.jsx -> appointmentController.js):

Frontend: CustomerDashboardPage.jsx fetches and displays approved doctors (GET /api/doctors/). User selects a doctor, date, and time, and clicks "Confirm Booking".

handleBookAppointment makes an axios.post request via api.js to http://localhost:8080/api/appointments/book. The JWT token is automatically attached by api.js interceptor.

Backend:

index.js receives the POST request.

appointmentRoutes.js maps to bookAppointment in appointmentController.js.

bookAppointment:

Extracts doctorId, appointmentDate, documents from req.body and customerId from req.user._id (from the token).

Verifies: Checks if the target doctorId exists as an isApproved doctor User and if their DoctorProfile exists.

Creates a new Appointment document (Appointment.create()), setting paymentStatus to 'paid' by default (simulating payment).

Increments totalAppointments in the doctor's DoctorProfile.

Sends 201 Created response.

Frontend: CustomerDashboardPage.jsx receives success. Dispatches bookAppointmentSuccess to Redux, shows alert, closes modal.

Doctor Profile Update (DoctorDashboardPage.jsx -> doctorController.js):

Frontend: After logging in as an approved doctor, DoctorDashboardPage.jsx fetches the doctor's profile (GET /api/doctors/profile). It populates the "Update Profile" modal with this data. User modifies fields and clicks "Save Changes".

handleProfileUpdate makes an axios.put request via api.js to http://localhost:8080/api/doctors/profile.

Backend:

index.js receives the PUT request.

doctorRoutes.js maps to updateDoctorProfile in doctorController.js.

updateDoctorProfile:

Extracts updated fields from req.body.

Finds the doctor's DoctorProfile using req.user._id.

Crucially: If the DoctorProfile document is not found, it sends a 404 Not Found error.

If found, it updates the fields of the DoctorProfile document and saves it (doctorProfile.save()).
Sends 200 OK response with the updated profile.
Frontend: DoctorDashboardPage.jsx receives the response. Shows an alert, closes the modal. If a 404 was received, it alerts the user to create their profile.
This detailed breakdown shows how each part of your Docspot application contributes to the overall functionality, working in harmony through API requests and state management.
