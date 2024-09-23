// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { scrapeWebsite } = require('../controllers/scrapeController');
const { scrapeCombined } = require('../controllers/scrapeGameController');
// Get all users

// Create a new user
router.get('/scrape', scrapeWebsite);
router.post('/scrape-combined', scrapeCombined);





module.exports = router;
