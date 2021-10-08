const {Router} = require('express');

const {controller404} = require('../controllers');

const router = Router();

router.get('/', controller404);

module.exports = router;