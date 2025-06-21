const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultationSchedule.controller');
router.get('/filter', controller.getSchedulesByCounselorAndDate);

// Lấy tất cả hoặc thêm mới hoặc xóa
router.get('/', controller.getAllSchedules);
router.post('/', controller.createSchedule);
router.delete('/:id', controller.deleteSchedule);

// 🔥 Thêm dòng này để filter theo counselorId & date

module.exports = router;
