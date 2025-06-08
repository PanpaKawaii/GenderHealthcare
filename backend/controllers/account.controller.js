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
    
    const user = await Account.findOne({ email });
    
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        exists: false, 
        message: 'Email is available for registration' 
      });
    }
    
  
    if (user.password) {
      return res.status(200).json({ 
        success: true, 
        exists: true,
       data: user,
        type: 'normal',
        
        message: 'User exists with normal authentication'
      });
    } else {
      return res.status(200).json({ 
        success: true, 
        exists: true,
        data: user, 

        type: 'google',
        message: 'User exists with Google authentication'
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