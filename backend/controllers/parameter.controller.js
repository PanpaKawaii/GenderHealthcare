const Parameter = require('../models/parameter.model');

exports.create = async (req, res) => {
  try {
    const parameter = new Parameter(req.body);
    await parameter.save();
    res.status(201).json(parameter);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await Parameter.find());
exports.getOne = async (req, res) => {
  const parameter = await Parameter.findById(req.params.id);
  if (!parameter) return res.sendStatus(404);
  res.json(parameter);
};
exports.update = async (req, res) => {
  const parameter = await Parameter.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!parameter) return res.sendStatus(404);
  res.json(parameter);
};
exports.remove = async (req, res) => {
  const c = await Parameter.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
