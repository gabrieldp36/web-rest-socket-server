const {Router} = require('express');

const {check} = require('express-validator');

const {cargarArchivo, 
    actualizarImagenCloudinary,
    mostarImagenCloudinary,} = require('../controllers');

const {validarJWT, 
    tieneRolRequerido,
    validarCampos,
    esAdminRoleColeccionUsuarios,
    validarArchivo,} = require('../middleware');

const {coleccionesPermitidas} = require('../helpers');

const router = Router();

// Subir archivos - Ruta privada - Cualquier persona con JWT válido.

router.post('/', [

    validarJWT,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    validarArchivo

] ,cargarArchivo);

// Actualizar imágenes - Ruta privada - Para actualizar imágenes de usuarios se requiere ADMIN_ROLE.

router.put('/:coleccion/:id', [

    validarJWT,

    check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'] ) ),

    validarCampos,

    esAdminRoleColeccionUsuarios,

    tieneRolRequerido('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),

    validarArchivo,

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,

], actualizarImagenCloudinary);

// Ruta pública.

router.get('/:coleccion/:id', [

    check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'] ) ),

    validarCampos,

    check('id', 'El id ingresado no es válido.').isMongoId(),

    validarCampos,

], mostarImagenCloudinary);

module.exports = router;