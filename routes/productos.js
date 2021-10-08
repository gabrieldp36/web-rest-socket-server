const {Router} = require('express');

const {check} = require('express-validator');

const {crearProducto, 
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto} = require('../controllers');

const {existeCategoriaPorId,
    esNombreValido,
    esPrecioValido,
    existeProductoPorId,
    existeNombreProducto,
    esEstadoValidoPut,
    disponibilidadValida,
    CategoriaPutProductos,
    esCategoriaActiva,} = require('../helpers');

const {validarCampos, 
    validarJWT, 
    esAdminRole,
    tieneRolRequerido,} = require('../middleware');

const router = Router();

// Obtener todas los productos - Ruta pública.

router.get('/', obtenerProductos);

// Obtener producto por id - Ruta pública.

router.get('/:id',[

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos, 
    
    check('id').custom(existeProductoPorId),

    validarCampos,

], obtenerProductoPorId);

// Crear un producto categía - Ruta privada - Cualquier persona con JWT válido.

router.post('/',[

    validarJWT,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    check('categoria', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,

    check('categoria').custom(existeCategoriaPorId),

    validarCampos,

    check('nombre').custom(esNombreValido),

    check('categoria', 'La categoría es obligatoria.').notEmpty(),

    check('precio').custom(esPrecioValido),

    validarCampos, 

], crearProducto);

// Actualizar un producto - Ruta privada - Cualquier persona con JWT válido.

router.put('/:id', [

    validarJWT,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeProductoPorId),

    validarCampos,

    check('categoria').custom(CategoriaPutProductos),

    validarCampos,

    check('categoria').custom(esCategoriaActiva),

    validarCampos,

    check('nombre').custom(existeNombreProducto),

    check('estado').custom(esEstadoValidoPut),

    check('precio').custom(esPrecioValido),

    check('disponibilidad').custom(disponibilidadValida),

    validarCampos,

], actualizarProducto);

// Borrar un producto - Ruta privada - Sólo Admin.

router.delete('/:id', [ 
    
    validarJWT,

    esAdminRole,

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,
    
    check('id').custom(existeProductoPorId),

    validarCampos,
    
], borrarProducto);

module.exports = router;