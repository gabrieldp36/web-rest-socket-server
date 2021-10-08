const {response, request} = require('express');

const {Categoria} = require('../models');

const obtenerCategorias = async (req = request, res = response) => {

    let {limite = 0, desde = 0} = req.query;

    const categoriasActivas = {estado: true};

    const [total, categorias] = await Promise.all([
        
        Categoria.countDocuments(categoriasActivas),
        Categoria.find(categoriasActivas)
            .populate({path:'usuario', select: ['nombre', 'apellido']})
            .skip( (isNaN(desde) ) ? desde : Number(desde) )
            .limit( (isNaN(limite) ) ? limite : Number(limite) ),
    ]);

    res.json({

        total,
        categorias,
    });
};

const obtenerCategoriaPorId = async (req = request, res = response) => {

    const id = req.params.id; 

    const categoria = await Categoria.findById(id).populate({path:'usuario', select: ['nombre', 'apellido']});

    if (!categoria.estado) {

        return res.status(400).json({

            msg: `La categoría ${categoria.nombre} no se encuentra disponible, consulte con el adminisitrador.`
        });
    };

    res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( {nombre} );

    if (categoriaDB) {

        return res.status(400).json({

            msg: `La categoría ${categoriaDB.nombre}, ya existe.`,
        });
    };

    // Generamos la data para guardarla en la DB.

    const data ={
        
        nombre,
        usuario: req.usuarioAuth._id,
    };

    const categoria = new Categoria(data);

    // Guardamos en DB.

    await Promise.all([

        categoria.save(),
        
        categoria.populate({path:'usuario', select: ['nombre', 'apellido']}),
    ]);

    res.status(201).json(categoria);
};

const actualizarCategoria = async (req = request, res = response) => {

    const id = req.params.id;

    const {__v, _id, nombre, estado, usuario} = req.body;

    const data = {};

    if ( !(nombre === undefined) && ( nombre.trim() ) ) {

        data.nombre = nombre.toUpperCase();
    };

    if (estado) {

        data.estado = estado;
    };

    data.usuario = req.usuarioAuth._id;
        
    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} ).populate({path:'usuario', select: ['nombre', 'apellido']});

    res.status(201).json(categoria);
};

const borrarCategoria = async (req = request, res = response) => {

    const id = req.params.id;

    // // Eliminación física de la Base de Datos.

    // const categoria = await Categoria.findByIdAndDelete(id);

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false} );

    categoria.usuario = req.usuarioAuth._id;

    await categoria.populate({path:'usuario', select: ['nombre', 'apellido']});

    res.json(categoria);
};

module.exports = {

    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
};