const TestResult = require('../models/testresult.model');

exports.create = async (req, res) => {
  try {
    const testresult = new TestResult(req.body);
    await testresult.save();
    res.status(201).json(testresult);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await TestResult.find().populate('testBookingId'));
exports.getOne = async (req, res) => {
  const testresult = await TestResult.findById(req.params.id).populate('testBookingId');
  if (!testresult) return res.sendStatus(404);
  res.json(testresult);
};
exports.update = async (req, res) => {
  const testresult = await TestResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testresult) return res.sendStatus(404);
  res.json(testresult);
};
exports.remove = async (req, res) => {
  const c = await TestResult.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
