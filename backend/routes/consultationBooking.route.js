const express = require('express');
const router = express.Router();
const consultationBooking = require('../controllers/consultationBooking.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Customer xem booking của mình
router.get('/customer/:accountId',
  authenticate,
  authorize('Customer'),
  consultationBooking.getBookingsByCustomerAccount
);

// Counselor xem các lịch hẹn của mình
router.get('/counselor/:accountId',
  authenticate,
  authorize('Counselor'),
  consultationBooking.getBookingsByCounselorAccount
);

// Counselor hoặc Admin tra cứu thông tin customer từ account
router.get('/customers/byAccount/:accountId',
  authenticate,
  authorize('Counselor','Customer', 'Admin'),
  consultationBooking.getCustomerByAccountId
);

// Admin xem tất cả bookings
router.get('/',
  authenticate,
  authorize('Admin'),
  consultationBooking.getAllBookings
);

// Customer tạo booking
router.post('/',
  authenticate,
  authorize('Customer'),
  consultationBooking.createBooking
);

// Ai cũng có thể xem thông tin booking theo ID (nếu muốn hạn chế hơn có thể chỉnh lại)
router.get('/:id',
  authenticate,
  authorize('Admin', 'Counselor', 'Customer'),
  consultationBooking.getBookingById
);

// Counselor hoặc Admin cập nhật booking
router.put('/:id',
  authenticate,
  authorize('Admin', 'Counselor'),
  consultationBooking.updateBooking
);

// Admin xoá booking
router.delete('/:id',
  authenticate,
  authorize('Admin'),
  consultationBooking.deleteBooking
);

module.exports = router;
