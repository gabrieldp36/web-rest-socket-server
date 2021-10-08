const {Router} = require('express');

const {check} = require('express-validator');

const {login, googleSingIn, renovarJWT} = require('../controllers')

const {validarCampos, validarJWT} = require('../middleware');

const {validacionEmailAuth} = require('../helpers')

const router = Router();

router.post('/login', [

    check('correo').custom(validacionEmailAuth),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos,

], login);

router.post('/google', [

    check('id_token', 'El Id Token es obligatorio.').notEmpty(),
    validarCampos,

], googleSingIn);

router.get('/', validarJWT, renovarJWT);

module.exports = router;