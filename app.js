const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');

// Load environment variables
dotenv.config();

connectDB();

// Initialize Express
const app = express();

// Enable CORS with environment-dependent origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3011',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
