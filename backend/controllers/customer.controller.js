const Customer = require('../models/customer.model');

exports.create = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await Customer.find().populate('accountId'));
exports.getOne = async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate('accountId');
  if (!customer) return res.sendStatus(404);
  res.json(customer);
};
exports.update = async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) return res.sendStatus(404);
  res.json(customer);
};
exports.remove = async (req, res) => {
  const c = await Customer.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
