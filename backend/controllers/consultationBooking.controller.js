const consultationBooking = require('../models/consultationBooking.model');
const Customer =require('../models/customer.model');
const Counselor = require('../models/counselor.model');
const Schedule =require('../models/consultationSchedule.model')

// Lấy tất cả booking
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

// Tạo booking mới
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new consultationBooking(req.body);
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật booking
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await consultationBooking.findByIdAndUpdate(
      bookingId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xoá booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await consultationBooking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy 1 booking theo ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await consultationBooking.findById(req.params.id)
      .populate({
        path: 'customerId',
        populate: { path: 'accountId' }
      })
      .populate({
        path: 'scheduleId',
        populate: {
          path: 'counselorId',
          populate: { path: 'accountId' }
        }
      });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//View history booking tư vấn (của khách hàng)
exports.getBookingsByCustomerAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const customer = await Customer.findOne({ accountId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const bookings = await consultationBooking.find({ customerId: customer._id })
      .populate({
        path: 'scheduleId',
        populate: {
          path: 'counselorId',
          populate: { path: 'accountId' } 
        }
      })
      .populate({
        path: 'customerId',
        populate: { path: 'accountId' } 
      });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//View history booking tư vấn (của khách hàng)
exports.getBookingsByCounselorAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const counselor = await Counselor.findOne({ accountId });
    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found' });
    }

    const schedules = await Schedule.find({ counselorId: counselor._id });
    const scheduleIds = schedules.map(s => s._id);

    const bookings = await consultationBooking.find({ scheduleId: { $in: scheduleIds } })
      .populate({
        path: 'scheduleId',
        populate: {
          path: 'counselorId',
          populate: { path: 'accountId' }
        }
      })
      .populate({
        path: 'customerId',
        populate: { path: 'accountId' }
      });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Lấy thông tin Customer theo accountId
exports.getCustomerByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    const customer = await Customer.findOne({ accountId });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
