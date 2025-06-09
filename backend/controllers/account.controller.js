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

//for email
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await Account.find({ email: email });

    if (user.length >= 2) {
      return res.status(200).json({
        success: true,
        existsNormal: true,
        existsGoogle: true,
        allowRegister: false,
      });
    } else if (user.length == 1) {
      if (user[0].password) {
        return res.status(200).json({
          success: true,
          existsNormal: true,
          existsGoogle: false,
          allowRegister: false,
        });
      } else {
        return res.status(200).json({
          success: true,
          existsNormal: false,
          existsGoogle: true,
          allowRegister: true,
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        existsNormal: false,
        existsGoogle: false,
        allowRegister: true,
      });
    }

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.authentication = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await Account.find({ email: email });

    if (user.length <= 0) {
      return res.status(200).json({
        success: true,
        allowLogin: false,
      });
    } else {
      for (let i = 0; i < user.length; i++) {
        const isMatch = password == user[i].password;

        if (isMatch) {
          return res.status(200).json({
            success: true,
            allowLogin: true,
            userInfo: user[i],
          });
        }

        return res.status(200).json({
          success: true,
          allowLogin: false,
        });
      }
    }

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};