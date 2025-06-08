const express = require('express');
const router = express.Router();
const consultationBooking = require('../controllers/consultationBooking.controller');

router.get('/', consultationBooking.getAllBookings);
router.post('/', consultationBooking.createBooking);

module.exports = router;
