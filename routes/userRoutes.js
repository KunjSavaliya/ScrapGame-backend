// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {scrapeWindowGame } = require('../controllers/scrapeWindowGameController');
const {scrapeCombined } = require('../controllers/scrapeGameController');
const { scrapeTopFreeGame } = require('../controllers/PhoneGame/scrapeTopFreeGameController');
const { scrapeCasualGame } = require('../controllers/PhoneGame/CasualGamesController');
const { scrapeTabletGame } = require('../controllers/TabletGame/TabletGameController');
// Get all users

// Create a new user
router.get('/scrape', scrapeWindowGame);
router.post('/scrape-combined', scrapeCombined);
router.get('/scrape-topfreegame', scrapeTopFreeGame);
router.get('/scrape-casualgame', scrapeCasualGame);
router.get('/scrape-tabletgame', scrapeTabletGame);









module.exports = router;
