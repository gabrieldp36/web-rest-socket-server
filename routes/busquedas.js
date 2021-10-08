const {Router} = require('express');

const {buscar, buscarProductosPorCategoria} = require('../controllers');

const {esAdminRoleColeccionUsuarios, validarJWTColeccionUsarios, validarCampos,} = require('../middleware');

const router = Router();

router.get('/:coleccion/:termino', [

    validarJWTColeccionUsarios,

    esAdminRoleColeccionUsuarios,

], buscar);

router.get('/categorias/productos/:termino', buscarProductosPorCategoria);

module.exports = router;