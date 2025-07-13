const express = require('express');
const ctrl = require('../controllers/testresultdetail.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const r = express.Router();

r.post('/', authenticate, authorize('Admin', 'Doctor'), ctrl.create);
r.get('/', authenticate, ctrl.getAll);
r.get('/:id', authenticate, ctrl.getOne);
r.put('/:id', authenticate, authorize('Admin', 'Doctor'), ctrl.update);
r.delete('/:id', authenticate, authorize('Admin', 'Doctor'), ctrl.remove);

module.exports = r;
