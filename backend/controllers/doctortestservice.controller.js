const DoctorTestService = require("../models/doctortestservice.model");

exports.create = async (req, res) => {
  try {
    const dts = new DoctorTestService(req.body);
    await dts.save();
    res.status(201).json(dts);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAll = async (req, res) =>
  res.json(await DoctorTestService.find().populate("doctorId testServiceId"));

exports.getOne = async (req, res) => {
  const dts = await DoctorTestService.findById(req.params.id).populate(
    "doctorId testServiceId"
  );
  if (!dts) return res.sendStatus(404);
  res.json(dts);
};

exports.update = async (req, res) => {
  const dts = await DoctorTestService.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!dts) return res.sendStatus(404);
  res.json(dts);
};

exports.remove = async (req, res) => {
  const dts = await DoctorTestService.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!dts });
};
