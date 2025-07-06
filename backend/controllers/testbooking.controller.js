const TestBooking = require('../models/testbooking.model');

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
