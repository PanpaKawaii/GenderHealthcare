const Account = require('../models/account.model');

exports.create = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await Account.find());
exports.getOne = async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) return res.sendStatus(404);
  res.json(account);
};
exports.update = async (req, res) => {
  const acc = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!acc) return res.sendStatus(404);
  res.json(acc);
};
exports.remove = async (req, res) => {
  const acc = await Account.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!acc });
};
