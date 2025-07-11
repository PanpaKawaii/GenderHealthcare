const ConsultationSchedule = require('../models/consultationSchedule.model');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// [1] GET all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await ConsultationSchedule.find().populate('counselorId');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [2] CREATE a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = new ConsultationSchedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// [3] UPDATE a schedule by ID
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ConsultationSchedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [4] DELETE a schedule by ID
exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await ConsultationSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [NEW] GET schedules by counselorId and date
exports.getSchedulesByCounselorAndDate = async (req, res) => {
  try {
    const { counselorId, date } = req.query;

    if (!counselorId || !date) {
      return res.status(400).json({ error: 'Missing counselorId or date' });
    }

    const startOfDay = dayjs.tz(date, 'Asia/Ho_Chi_Minh').startOf('day').toDate();
    const endOfDay = dayjs.tz(date, 'Asia/Ho_Chi_Minh').endOf('day').toDate();

    const schedules = await ConsultationSchedule.find({
      counselorId: counselorId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
    }).populate('counselorId');

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [NEW] GET counselors who are available at specific date + time range
exports.getAvailableCounselorsBySlot = async (req, res) => {
  console.log('Called getAvailableCounselorsBySlot');
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing date, startTime or endTime' });
    }

    const start = dayjs.tz(`${date}T${startTime}`, 'Asia/Ho_Chi_Minh').toDate();
const end = dayjs.tz(`${date}T${endTime}`, 'Asia/Ho_Chi_Minh').toDate();


    const availableSchedules = await ConsultationSchedule.find({
      startTime: { $gte: start, $lt: end },
      status: 'available',
    }).populate({
      path: 'counselorId',
      populate: { path: 'accountId' }
    });

    const counselors = availableSchedules.map(sch => sch.counselorId);
    const uniqueCounselors = Array.from(new Set(counselors.map(c => c._id.toString())))
      .map(id => counselors.find(c => c._id.toString() === id));

    res.json(uniqueCounselors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [NEW] GET schedules by counselor's accountId
exports.getSchedulesByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!accountId) {
      return res.status(400).json({ error: 'Missing accountId' });
    }

    // populate nested counselorId -> accountId
    const schedules = await ConsultationSchedule.find()
      .populate({
        path: 'counselorId',
        match: { accountId: accountId } // lọc theo accountId của counselor
      });

    // Lọc bỏ những cái counselorId bị null (không khớp accountId)
    const filtered = schedules.filter(s => s.counselorId !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
