const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultationSchedule.controller');
router.get('/filter', controller.getSchedulesByCounselorAndDate);
// 🔥 Thêm route để lọc bác sĩ rảnh theo ngày + giờ
router.get('/available-counselors', controller.getAvailableCounselorsBySlot);

// Lấy tất cả hoặc thêm mới hoặc xóa
router.get('/', controller.getAllSchedules);
router.post('/', controller.createSchedule);
router.delete('/:id', controller.deleteSchedule);

module.exports = router;
