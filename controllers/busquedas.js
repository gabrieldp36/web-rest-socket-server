const {response, request} = require('express');

const {buscarUsuario, 
    buscarCategoria,
    buscarProductos,
    buscarCategoriasProductos} = require('../helpers');

const collecionesPermitidas = [

    'categorias',
    'productos',
    'usuarios',
];

const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    if ( !collecionesPermitidas.includes(coleccion) ) {

        return res.status(400).json({

            msg: `Las coleciones permitidas para búsquedas son las siguentes: ${collecionesPermitidas}`,
        });
    };

    switch(coleccion) {

        case 'usuarios':

            buscarUsuario(termino, res);
        
        break;

        case 'categorias':

            buscarCategoria(termino, res);
        
        break;

        case 'productos':

            buscarProductos(termino, res);
        
        break;

        default:

            res.status(500).json({

                msg: `No se ha impletado un procedimiento de búsqueda para la colección ${coleccion}. Por favor, consulte con el administrador.`
            });
    };
};

const buscarProductosPorCategoria = async (req = request, res = response) =>{
    
    const {termino} = req.params;

    buscarCategoriasProductos(termino, res);
};

module.exports = {

    buscar,
    buscarProductosPorCategoria,
};