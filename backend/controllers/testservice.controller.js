const TestService = require("../models/testservice.model");

exports.create = async (req, res) => {
  try {
    const service = new TestService(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAll = async (req, res) => res.json(await TestService.find());

exports.getOne = async (req, res) => {
  const service = await TestService.findById(req.params.id);
  if (!service) return res.sendStatus(404);
  res.json(service);
};

exports.update = async (req, res) => {
  const service = await TestService.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!service) return res.sendStatus(404);
  res.json(service);
};

exports.remove = async (req, res) => {
  const service = await TestService.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!service });
};
