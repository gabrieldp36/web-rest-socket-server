const {Router} = require('express');

const {chatController} = require('../controllers/chat');

const router = Router();

router.get('/', chatController);

module.exports = router;