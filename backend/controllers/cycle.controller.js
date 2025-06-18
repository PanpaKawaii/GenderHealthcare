const Cycle = require("../models/cycle.model");

exports.create = async (req, res) => {
  try {
    const cycle = new Cycle(req.body);
    const saved = await cycle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const cycles = await Cycle.find({ userId: req.params.customerId }).sort({
      periodStart: -1,
    });
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const cycle = await Cycle.findById(req.params.id);
  if (!cycle) return res.sendStatus(404);
  res.json(cycle);
};

exports.update = async (req, res) => {
  try {
    const updated = await Cycle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const result = await Cycle.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!result });
};
