const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultationSchedule.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Lọc lịch theo tư vấn viên và ngày
router.get(
  '/filter',
  authenticate,
  authorize('Customer', 'Counselor', 'Admin'),
  controller.getSchedulesByCounselorAndDate
);

// Lấy danh sách tư vấn viên rảnh theo khung giờ
router.get(
  '/available-counselors',
  authenticate,
  authorize('Customer', 'Admin'),
  controller.getAvailableCounselorsBySlot
);

// Lấy tất cả lịch
router.get(
  '/',
  authenticate,
  authorize('Admin', 'Counselor'),
  controller.getAllSchedules
);

router.get('/by-account/:accountId',
  authenticate,
  authorize('Admin', 'Counselor'),
  controller.getSchedulesByAccountId
);


// Tạo mới lịch
router.post(
  '/',
  authenticate,
  authorize('Admin'),
  controller.createSchedule
);

// Cập nhật lịch
router.put(
  '/:id',
  authenticate,
  authorize('Admin', 'Customer'),
  controller.updateSchedule
);

// Xóa lịch
router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  controller.deleteSchedule
);

module.exports = router;
