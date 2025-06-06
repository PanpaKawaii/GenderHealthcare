const express = require('express');
const ctrl = require('../controllers/comment.controller');
const r = express.Router();

r.post('/', ctrl.create);
r.get('/:id', ctrl.update); // nếu cần lấy chi tiết
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

module.exports = r;
