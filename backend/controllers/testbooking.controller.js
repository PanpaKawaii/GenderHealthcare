const TestBooking = require('../models/testbooking.model');
const Customer = require('../models/customer.model');
const Account = require('../models/account.model');

exports.create = async (req, res) => {
  try {
    const testbooking = new TestBooking(req.body);
    await testbooking.save();
    res.status(201).json(testbooking);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await TestBooking.find().populate('customerId').populate('doctorTestServiceId'));
exports.getOne = async (req, res) => {
  const testbooking = await TestBooking.findById(req.params.id).populate('customerId').populate('doctorTestServiceId');
  if (!testbooking) return res.sendStatus(404);
  res.json(testbooking);
};
exports.update = async (req, res) => {
  const testbooking = await TestBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testbooking) return res.sendStatus(404);
  res.json(testbooking);
};
exports.remove = async (req, res) => {
  const c = await TestBooking.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};

exports.getAllBooking = async (req, res) => {
  try {
    const bookings = await TestBooking.find().populate('customerId').populate({path: 'doctorTestServiceId',populate: {path: 'testServiceId',}});
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRefund = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updateData = req.body || {};

    const existingBooking = await TestBooking.findById(bookingId).populate({
      path: 'doctorTestServiceId',
      populate: { path: 'testServiceId' }
    });

    if (!existingBooking) return res.sendStatus(404);

    if (
       existingBooking.status !== 'Canceled' &&
      !existingBooking.isRefund
    ) {
      const price = existingBooking.doctorTestServiceId?.testServiceId?.price || 0;

      if (price > 0) {
        // Lấy customer để truy cập accountId
        const customer = await Customer.findById(existingBooking.customerId);

        if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
        }

        // Cộng tiền vào ví Account dựa trên accountId của customer
        await Account.findByIdAndUpdate(customer.accountId, { $inc: { wallet: price } });

        updateData.isRefund = true; // Đánh dấu đã refund
      }
    }
    updateData.status = 'Canceled';
    const updatedBooking = await TestBooking.findByIdAndUpdate(bookingId, updateData, { new: true });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: error.message });
  }
};
