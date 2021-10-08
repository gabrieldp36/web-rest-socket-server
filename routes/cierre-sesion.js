const {Router} = require('express');

const {cerrarSesion} = require('../controllers');

const router = Router();

router.get('/', cerrarSesion);

module.exports = router;