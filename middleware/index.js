const validarArchivo = require('./validar-archivo');

const validarCampos = require('../middleware/validar-campos');

const validarJWT = require('../middleware/validar-jwt');

const validarRoles = require('../middleware/validar-roles');

module.exports = {
    
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
};