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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Export the app for Vercel
module.exports = app;
