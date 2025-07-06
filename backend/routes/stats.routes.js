const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

// Community stats
router.get('/community', statsController.getCommunityStats);

module.exports = router;
