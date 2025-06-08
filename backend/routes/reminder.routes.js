const express = require('express');
const ctrl = require('../controllers/reminder.controller');
const r = express.Router();

// Thêm mới reminder cho customer
r.post('/', ctrl.create);
// Lấy tất cả reminder của 1 customer
r.get('/customer/:customerId', ctrl.getByCustomer);
// Lấy, update, xóa reminder theo id
r.get('/:id', ctrl.getOne);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

module.exports = r;
