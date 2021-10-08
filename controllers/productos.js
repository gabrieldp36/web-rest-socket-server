const {response, request} = require('express');

const {Producto, Categoria} = require('../models');

const obtenerProductos = async (req = request, res = response) => {

    let {limite = 0, desde = 0} = req.query;

    const productosActivos = {estado: true};

    const [elementos] = await Promise.all([
    
        Producto.find(productosActivos)
            .populate({path: 'categoria', select: ['nombre', 'estado']})
            .populate({path:'usuario', select: ['nombre', 'apellido']})
            .skip( (isNaN(desde) ) ? desde : Number(desde) )
            .limit( (isNaN(limite) ) ? limite : Number(limite) ),
    ]);

    let productos = elementos.filter( producto => producto.categoria.estado === true);

    res.json({

        total: productos.length,
        productos,
    });
};

const obtenerProductoPorId = async (req = request, res = response) => {

    const id = req.params.id; 

    const producto= await Producto.findById(id)
                        .populate('categoria', 'nombre')
                        .populate({path:'usuario', select: ['nombre', 'apellido']});

    const categoria = await Categoria.findById(producto.categoria._id)

    if (!categoria.estado) {

        return res.status(400).json({

            msg: `El producto ${producto.nombre} no se encuentra disponible. La categoria ${categoria.nombre} ha sido discontinuada. Por favor, consulte con el adminisitrador.`
        });
    };

    if (!producto.estado) {

        return res.status(400).json({

            msg: `El producto ${producto.nombre} no se encuentra disponible, consulte con el adminisitrador.`
        });
    };

    res.json(producto);
};

const crearProducto = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne( {nombre} );

    if (productoDB) {

        return res.status(400).json({

            msg: `El producto ${productoDB.nombre}, ya existe.`,
        });
    };

    // Generamos la data para guardarla en la DB.

    const data ={
        
        nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        img: req.body.img,
        categoria: req.body.categoria,
        usuario: req.usuarioAuth._id,
    };

    const producto = new Producto (data);

    // Guardamos en DB.

    await Promise.all([

        producto.save(),
        
        producto.populate('categoria', 'nombre'),

        producto.populate({path:'usuario', select: ['nombre', 'apellido']}),
    ]);

    res.status(201).json(producto);
};

const actualizarProducto = async (req = request, res = response) => {

    const id = req.params.id;

    const {
        __v, 
        _id,
        nombre, 
        estado, 
        precio, 
        descripcion, 
        disponibilidad, 
        categoria, 
        usuario
    } = req.body;

    const data = {};

    if ( !nombre === undefined && nombre.trim() ) {

        data.nombre = nombre.toUpperCase();
    };

    if (estado) {

        data.estado = estado;
    };

    if (descripcion) {

        data.descripcion = descripcion;
    };

    if(disponibilidad || disponibilidad === false) {

        data.disponibilidad = disponibilidad;
    };

    if (categoria) {

        data.categoria = categoria;
    };

    data.precio = precio;

    data.usuario = req.usuarioAuth._id;
        
    const producto = await Producto.findByIdAndUpdate( id, data, {new: true} )
                        .populate('categoria', 'nombre')
                        .populate({path:'usuario', select: ['nombre', 'apellido']});

    res.status(201).json(producto);
};

const borrarProducto = async (req = request, res = response) => {

    const id = req.params.id;

    // // Eliminación física de la Base de Datos.

    // const categoria = await Categoria.findByIdAndDelete(id);

    const producto = await Producto.findByIdAndUpdate( id, {estado: false} ).populate('categoria', 'nombre');

    producto.usuario = req.usuarioAuth._id;

    await producto.populate({path:'usuario', select: ['nombre', 'apellido']});

    res.json(producto);
};

module.exports = {

    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto,
};