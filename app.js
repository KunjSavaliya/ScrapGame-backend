// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Change this to match your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as needed
    credentials: true // Allow credentials if required
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
