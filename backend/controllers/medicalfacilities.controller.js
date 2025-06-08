const MedicalFacilities = require("../models/medicalfacilities.model");

exports.create = async (req, res) => {
  try {
    const facility = new MedicalFacilities(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAll = async (req, res) => res.json(await MedicalFacilities.find());

exports.getOne = async (req, res) => {
  const facility = await MedicalFacilities.findById(req.params.id);
  if (!facility) return res.sendStatus(404);
  res.json(facility);
};

exports.update = async (req, res) => {
  const facility = await MedicalFacilities.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!facility) return res.sendStatus(404);
  res.json(facility);
};

exports.remove = async (req, res) => {
  const facility = await MedicalFacilities.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!facility });
};
