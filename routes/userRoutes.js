// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { scrapeWebsite } = require('../controllers/scrapeController');
const { scrapeWebsiteDescription } = require('../controllers/scrapeDescriptionController');
const { scrapeDetails } = require('../controllers/ScrapeDetails');
const { scrapeGame } = require('../controllers/scrapeGameController');
// Get all users

// Create a new user
router.get('/scrape', scrapeWebsite);
router.post('/scrape-description', scrapeWebsiteDescription);
router.post('/scrape-Details', scrapeDetails);
router.post('/scrape-game', scrapeGame);




module.exports = router;
