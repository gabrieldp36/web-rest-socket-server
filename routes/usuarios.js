const {Router} = require('express');

const {check} = require('express-validator');

const {usuariosGet, 
    usuariosPut, 
    usuariosPost,
    usuariosDelete,} = require('../controllers');

const {validarCampos, 
    validarJWT, 
    esAdminRole,
    tieneRolRequerido,} = require('../middleware');

const { existeUsuarioById,
    esNombreValido,
    esApellidoValido,
    esRolValidoPost,
    validacionEmailPost,
    passwordPost,
    validacionEmailPut,
    esRolValidoPut,
    passwordPut,
    esEstadoValidoPut,} = require('../helpers');

const router = Router();

router.get('/', [

    validarJWT,

    esAdminRole,

    // Validar múltiples roles.

    // tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE'),

], usuariosGet);

router.put('/:id', [

    validarJWT,

    esAdminRole,

    // Validar múltiples roles.

    // tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE'),

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeUsuarioById),

    validarCampos,

    check('correo').custom(validacionEmailPut),

    check('password').custom(passwordPut),

    check('rol').custom(esRolValidoPut),

    check('estado').custom(esEstadoValidoPut),

    validarCampos,

], usuariosPut);

router.post('/', [

    validarJWT,

    esAdminRole,

    // Validar múltiples roles.

    // tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE'),

    check('nombre').custom(esNombreValido),

    check('apellido').custom(esApellidoValido),

    check('correo').custom(validacionEmailPost),

    check('password').custom(passwordPost),

    check('rol').custom(esRolValidoPost),

    validarCampos,

], usuariosPost);

router.delete('/:id',[

    validarJWT,

    esAdminRole,

    // Validar múltiples roles.

    // tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE'),
    
    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeUsuarioById),

    validarCampos,

], usuariosDelete);

module.exports = router;