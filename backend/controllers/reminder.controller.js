const Reminder = require('../models/reminder.model');


exports.create = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};


exports.getByCustomer = async (req, res) => {
  const reminders = await Reminder.find({ customerId: req.params.customerId }).sort({ date: -1 });
  res.json(reminders);
};


exports.getOne = async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) return res.sendStatus(404);
  res.json(reminder);
};


exports.update = async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!reminder) return res.sendStatus(404);
  res.json(reminder);
};


exports.remove = async (req, res) => {
  const result = await Reminder.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!result });
};
