const ConsultationSchedule = require('../models/consultationSchedule.model');


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

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

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

    const start = new Date(`${date}T${startTime}:00.000Z`);
    const end = new Date(`${date}T${endTime}:00.000Z`);

    const availableSchedules = await ConsultationSchedule.find({
      startTime: { $gte: start, $lt: end },
      status: 'available',
    }).populate({
      path: 'counselorId',
      populate: { path: 'accountId' }
    });


    // Lấy unique counselors
    const counselors = availableSchedules.map(sch => sch.counselorId);
    const uniqueCounselors = Array.from(new Set(counselors.map(c => c._id.toString())))
      .map(id => counselors.find(c => c._id.toString() === id));

    res.json(uniqueCounselors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
