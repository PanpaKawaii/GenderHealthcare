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
