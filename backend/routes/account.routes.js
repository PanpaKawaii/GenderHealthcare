const express = require('express');
const accountCtrl = require('../controllers/account.controller');
const router = express.Router();

router.post('/', accountCtrl.create);
router.get('/', accountCtrl.getAll);
router.get('/:id', accountCtrl.getOne);
router.put('/:id', accountCtrl.update);
router.delete('/:id', accountCtrl.remove);
router.post('/check-email', accountCtrl.checkEmail);
router.post('/authentication', accountCtrl.authentication);
router.get('/:accountId/posts', accountCtrl.getAccountPosts);

module.exports = router;
