// const express = require('express');
// const ctrl = require('../controllers/question.controller');
// const commentCtrl = require('../controllers/comment.controller');
// const r = express.Router();

// r.post('/', ctrl.create);
// r.get('/', ctrl.getAll);
// r.get('/:id', ctrl.getOne);
// r.put('/:id', ctrl.update);
// r.delete('/:id', ctrl.remove);

// // Nested comment
// r.post('/:id/comments', commentCtrl.create);
// r.get('/:id/comments', commentCtrl.getByQuestion);

// module.exports = r;
// // question id : 665104646c95643eb8ac8af0
// //account id : 6650fe8e8f3a8d6ff13d22a1

// Cập nhật routes/question.routes.js
const express = require('express');
const router = express.Router();
const questionCtrl = require('../controllers/question.controller');
const commentCtrl = require('../controllers/comment.controller');

// Question routes
router.post('/', questionCtrl.create);
router.get('/', questionCtrl.getAll);
router.get('/:id', questionCtrl.getOne);
router.put('/:id', questionCtrl.update);
router.delete('/:id', questionCtrl.remove);

// Comment routes
router.get('/:id/comments', commentCtrl.getByQuestion);
router.post('/:id/comments', questionCtrl.createComment);

module.exports = router;