const {Router} = require('express');

const {controller401} = require('../controllers');

const router = Router();

router.get('/', controller401);

module.exports = router;