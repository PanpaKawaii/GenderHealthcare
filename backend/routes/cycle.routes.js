const express = require('express');
const ctrl = require('../controllers/cycle.controller');
const r = express.Router();

// Thêm mới cycle cho customer
r.post('/', ctrl.create);
// Lấy tất cả cycle của 1 customer
r.get('/customer/:customerId', ctrl.getByCustomer);
// Lấy, update, xóa cycle theo id
r.get('/:id', ctrl.getOne);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

module.exports = r;
