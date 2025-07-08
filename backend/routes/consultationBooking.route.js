const express = require('express');
const router = express.Router();
const consultationBooking = require('../controllers/consultationBooking.controller');

router.get('/customer/:accountId', consultationBooking.getBookingsByCustomerAccount);
router.get('/counselor/:accountId', consultationBooking.getBookingsByCounselorAccount);
router.get('/customers/byAccount/:accountId', consultationBooking.getCustomerByAccountId);

router.get('/', consultationBooking.getAllBookings);
router.post('/', consultationBooking.createBooking);
router.get('/:id', consultationBooking.getBookingById);
router.put('/:id', consultationBooking.updateBooking);
router.delete('/:id', consultationBooking.deleteBooking);

module.exports = router;
