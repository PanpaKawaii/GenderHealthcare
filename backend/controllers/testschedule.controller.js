const TestSchedule = require('../models/testschedule.model');

exports.create = async (req, res) => {
  try {
    const testschedule = new TestSchedule(req.body);
    await testschedule.save();
    res.status(201).json(testschedule);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await TestSchedule.find().populate('doctorTestServiceId'));
exports.getOne = async (req, res) => {
  const testschedule = await TestSchedule.findById(req.params.id).populate('doctorTestServiceId');
  if (!testschedule) return res.sendStatus(404);
  res.json(testschedule);
};
exports.update = async (req, res) => {
  const testschedule = await TestSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testschedule) return res.sendStatus(404);
  res.json(testschedule);
};
exports.remove = async (req, res) => {
  const c = await TestSchedule.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
