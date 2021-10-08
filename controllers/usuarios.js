const {response, request} = require('express');

const bcryptjs = require('bcryptjs');

const {Usuario} = require('../models');

const usuariosGet = async (req = request, res = response) => {

    let {limite = 0, desde = 0} = req.query;

    const usuariosActivos = {estado: true};

    const [total, usuarios] = await Promise.all([
        
        Usuario.countDocuments(usuariosActivos),
        Usuario.find(usuariosActivos)
            .skip( (isNaN(desde) ) ? desde : Number(desde) )
            .limit( (isNaN(limite) ) ? limite : Number(limite) ),
        
    ]);

    res.json({

        total,
        usuarios,
    });
};

const usuariosPost = async (req = request, res = response) => {

    const {nombre, apellido, correo, password, img, rol } = req.body;

    const usuario = new Usuario( {nombre, apellido, correo, password, img, rol } );

    // Encriptar la contraseña.

    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB.

    await usuario.save();

    res.status(201).json(usuario);
};

const usuariosPut = async (req = request, res = response) => {

    const id = req.params.id;

    const {__v, _id, google, nombre, apellido, correo, password, rol, estado} = req.body;

    const data = {};
    
    if ( !nombre === undefined && nombre.trim() ) {

        data.nombre = nombre;
    };

    if ( !apellido === undefined && apellido.trim() ) {

        data.apellido = apellido;
    };

    if (correo) {

        data.correo = correo;
    };

    if (password && password.length > 0) {

        // Encriptamos el nuevo password del usuario.

        const salt = bcryptjs.genSaltSync();

        data.password = bcryptjs.hashSync(password, salt);
    };

    if (rol) {

        data.rol = rol;
    };

    if (estado) {

        data.estado = estado;
    };

    const usuario = await Usuario.findByIdAndUpdate( id, data, {new: true} );

    res.status(201).json(usuario);
};

const usuariosDelete = async (req = request, res = response) => {

    const id = req.params.id;

    // Eliminación física de la Base de Datos.

    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} );

    res.json(usuario);
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
};