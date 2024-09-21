const app = require('./app'); // Adjust the path as necessary

const PORT = process.env.PORT || 5000;

// Export the app to be used by Vercel
module.exports = app;
