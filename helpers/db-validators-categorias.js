const {Categoria} = require('../models');

const existeCategoriaPorId = async (id) => {
    
    const existeCategoria = await Categoria.findById(id)

    if (!existeCategoria) {

        throw new Error(`El id ${id}, no existe.`);
    };

};

const existeNombreCategoria = async (nombre = '') => {

    if ( await Categoria.findOne( {nombre: nombre.toUpperCase()} ) ) {

        throw new Error(`La categoría ${nombre.toUpperCase()}, ya existe.`);
    };
};

module.exports = {

    existeCategoriaPorId,
    existeNombreCategoria,
};