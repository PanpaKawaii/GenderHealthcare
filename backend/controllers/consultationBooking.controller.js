const consultationBooking = require('../models/consultationBooking.model');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await consultationBooking.find()
      .populate('customerId')
      .populate('scheduleId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const newBooking = new consultationBooking(req.body);
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


