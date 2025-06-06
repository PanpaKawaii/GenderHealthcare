const express = require('express');
const ctrl = require('../controllers/testresultdetail.controller');
const r = express.Router();

r.post('/', ctrl.create);
r.get('/', ctrl.getAll);
r.get('/:id', ctrl.getOne);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

module.exports = r;
