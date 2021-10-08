const {Producto, Categoria} = require("../models");

const {isValidObjectId} = require('mongoose');

const esPrecioValido = async (precio)  => {

    if ( !(precio === undefined) && ( (isNaN(precio) ) || precio.length === 0 ) ) { 

        throw new Error('El precio debe ser ingresado en números.');
    };
};

const existeProductoPorId = async (id) => {

    const existeProducto = await Producto.findById(id)

    if (!existeProducto) {

        throw new Error(`El id ${id}, no existe.`);
    };
};

const existeNombreProducto = async (nombre = '') => {

    if ( await Producto.findOne( {nombre: nombre.toUpperCase()} ) ) {

        throw new Error(`El producto ${nombre.toUpperCase()}, ya existe.`);
    };
};

const disponibilidadValida = async (disponibilidad) => {

    if ( ! ( (disponibilidad === true) || (disponibilidad === false) ) && !(disponibilidad === undefined) ) {

        throw new Error('La disponibilidad sólo puede ser actualizada a true o false.');
    };
};

const CategoriaPutProductos = async (id) => {

    if (id === undefined) {

        return;
    };

    if (id.length >= 0) {

        if ( isValidObjectId(id) ) {

            const existeCategoria = await Categoria.findById(id)

            if (!existeCategoria) {

                throw new Error(`El id ${id}, no existe.`);
            };

        } else {
            
            throw new Error(`El id ${id}, no es un Mongo-Id válido.`);
        }; 
    };
};

const esCategoriaActiva = async (categoriaId) => {

    const categoria = await Categoria.findById(categoriaId)

    if (categoria && !categoria.estado ) {
        
        throw new Error(`La categoría ${categoria.nombre} ha sido discontinuada. Por favor, elija otra categoría o consulte con el adminisitrador.`);

    };
};

module.exports = {

    esPrecioValido,
    existeProductoPorId,
    existeNombreProducto,
    disponibilidadValida,
    CategoriaPutProductos,
    esCategoriaActiva,
};