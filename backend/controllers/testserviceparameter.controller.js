const TestServiceParameter = require('../models/testserviceparameter.model');

exports.create = async (req, res) => {
  try {
    const testserviceparameter = new TestServiceParameter(req.body);
    await testserviceparameter.save();
    res.status(201).json(testserviceparameter);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await TestServiceParameter.find().populate('testServiceId').populate('parameterId'));
exports.getOne = async (req, res) => {
  const testserviceparameter = await TestServiceParameter.findById(req.params.id).populate('testServiceId').populate('parameterId');
  if (!testserviceparameter) return res.sendStatus(404);
  res.json(testserviceparameter);
};
exports.update = async (req, res) => {
  const testserviceparameter = await TestServiceParameter.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testserviceparameter) return res.sendStatus(404);
  res.json(testserviceparameter);
};
exports.remove = async (req, res) => {
  const c = await TestServiceParameter.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
