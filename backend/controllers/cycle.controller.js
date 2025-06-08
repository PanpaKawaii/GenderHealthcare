const Cycle = require('../models/cycle.model');

exports.create = async (req, res) => {
  try {
    const cycle = new Cycle(req.body);
    await cycle.save();
    res.status(201).json(cycle);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getByCustomer = async (req, res) => {
  const cycles = await Cycle.find({ customerId: req.params.customerId }).sort({ startDate: -1 });
  res.json(cycles);
};


exports.getOne = async (req, res) => {
  const cycle = await Cycle.findById(req.params.id);
  if (!cycle) return res.sendStatus(404);
  res.json(cycle);
};


exports.update = async (req, res) => {
  const cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cycle) return res.sendStatus(404);
  res.json(cycle);
};


exports.remove = async (req, res) => {
  const result = await Cycle.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!result });
};
