const authControllers = require('../controllers/auth');

const busquedasControllers = require('../controllers/busquedas');

const categoriasControllers = require('../controllers/categorias');

const cierreSesion = require('../controllers/cierre-sesion');

const error401 = require('../controllers/401');

const error404 = require('../controllers/404');

const productosControllers = require('../controllers/productos');

const usuariosControllers = require('../controllers/usuarios');

const uploadsControllers = require('../controllers/uploads');

module.exports = {
    
    ...authControllers,
    ...busquedasControllers,
    ...categoriasControllers,
    ...cierreSesion,
    ...error401,
    ...error404,
    ...productosControllers,
    ...usuariosControllers,
    ...uploadsControllers,
};