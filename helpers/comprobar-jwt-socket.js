const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const comprobarJWT = async (token = '') => {

    try{

        if (!token) {

            return null;
        };

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario) {

            return null;
        };

        if (!usuario.estado) {

            return null;
        };

        if (usuario) {

            return usuario;
        };

    } catch (error) {

        return null;
    };
};

module.exports = {

    comprobarJWT,
};
