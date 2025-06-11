const express = require('express');
const router = express.Router();
const controller = require('../controllers/blog.controller');

router.get('/', controller.getAllPosts);
router.post('/', controller.createPost);
router.put('/:id', controller.updatePost);
router.delete('/:id', controller.deletePost);

router.get('/:id', controller.getPostById);

module.exports = router;
