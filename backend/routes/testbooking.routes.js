const express = require('express');
const ctrl = require('../controllers/testbooking.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const r = express.Router();

r.post('/', authenticate, ctrl.create);
r.get('/', authenticate, ctrl.getAll);
r.get('/:id', authenticate, ctrl.getOne);
r.put('/:id', authenticate, authorize('Admin', 'Doctor'), ctrl.update);
r.delete('/:id', authenticate, authorize('Admin', 'Doctor'), ctrl.remove);
r.put('/:id/refund', authenticate, ctrl.updateRefund);
r.get('/', authenticate, ctrl.getAllBooking);
module.exports = r;
