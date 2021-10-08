const {Router} = require('express');

const {check} = require('express-validator');

const {crearCategoria, 
    obtenerCategorias, 
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria,} = require('../controllers');

const {existeCategoriaPorId,
    esNombreValido,
    existeNombreCategoria,
    esEstadoValidoPut,} = require('../helpers');

const {validarCampos, 
    validarJWT, 
    esAdminRole,
    tieneRolRequerido,} = require('../middleware');

const router = Router();

// Obtener todas las categorías - Ruta pública.

router.get('/', obtenerCategorias);

// Obtener una categoría por id - Ruta pública.

router.get('/:id', [

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeCategoriaPorId),

    validarCampos,

], obtenerCategoriaPorId);

// Crear una categía - Ruta privada - Cualquier persona con JWT válido.

router.post('/', [

    validarJWT,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    check('nombre').custom(esNombreValido),

    validarCampos,

], crearCategoria);

// Actualizar una categoría - Ruta privada - Cualquier persona con JWT válido.

router.put('/:id', [

    validarJWT,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeCategoriaPorId),

    validarCampos,

    check('nombre').custom(existeNombreCategoria),

    check('estado').custom(esEstadoValidoPut),

    validarCampos,

], actualizarCategoria);

// Borrar una categoría - Ruta privada - Sólo Admin.

router.delete('/:id', [

    validarJWT,

    esAdminRole,

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeCategoriaPorId),

    validarCampos,

], borrarCategoria);

module.exports = router;