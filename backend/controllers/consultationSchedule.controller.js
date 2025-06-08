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
