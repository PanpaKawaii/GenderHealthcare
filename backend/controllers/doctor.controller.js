const Doctor = require("../models/doctor.model");

exports.create = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAll = async (req, res) =>
  res.json(await Doctor.find().populate("accountId"));

exports.getOne = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate("accountId");
  if (!doctor) return res.sendStatus(404);
  res.json(doctor);
};

exports.update = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doctor) return res.sendStatus(404);
  res.json(doctor);
};

exports.remove = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!doctor });
};
