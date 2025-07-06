const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/consultationBookingController');

router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

router.get('/customer/:accountId', bookingController.getBookingsByCustomerAccount);
router.get('/counselor/:accountId', bookingController.getBookingsByCounselorAccount);


module.exports = router;
