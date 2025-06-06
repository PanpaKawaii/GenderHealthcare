const express = require('express');
const ctrl = require('../controllers/question.controller');
const commentCtrl = require('../controllers/comment.controller');
const r = express.Router();

r.post('/', ctrl.create);
r.get('/', ctrl.getAll);
r.get('/:id', ctrl.getOne);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

// Nested comment
r.post('/:id/comments', commentCtrl.create);
r.get('/:id/comments', commentCtrl.getByQuestion);

module.exports = r;
