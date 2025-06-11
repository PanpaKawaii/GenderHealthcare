const TestResultDetail = require('../models/testresultdetail.model');

exports.create = async (req, res) => {
  try {
    const testresultdetail = new TestResultDetail(req.body);
    await testresultdetail.save();
    res.status(201).json(testresultdetail);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await TestResultDetail.find().populate('testResultId').populate('parameterId'));
exports.getOne = async (req, res) => {
  const testresultdetail = await TestResultDetail.findById(req.params.id).populate('testResultId').populate('parameterId');
  if (!testresultdetail) return res.sendStatus(404);
  res.json(testresultdetail);
};
exports.update = async (req, res) => {
  const testresultdetail = await TestResultDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testresultdetail) return res.sendStatus(404);
  res.json(testresultdetail);
};
exports.remove = async (req, res) => {
  const c = await TestResultDetail.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
