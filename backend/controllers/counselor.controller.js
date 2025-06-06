const Counselor = require('../models/counselor.model');

exports.create = async (req, res) => {
  try {
    const counselor = new Counselor(req.body);
    await counselor.save();
    res.status(201).json(counselor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await Counselor.find().populate('accountId'));
exports.getOne = async (req, res) => {
  const counselor = await Counselor.findById(req.params.id).populate('accountId');
  if (!counselor) return res.sendStatus(404);
  res.json(counselor);
};
exports.update = async (req, res) => {
  const counselor = await Counselor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!counselor) return res.sendStatus(404);
  res.json(counselor);
};
exports.remove = async (req, res) => {
  const c = await Counselor.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
