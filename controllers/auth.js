const {response, request} = require('express');

const bcryptjs = require('bcryptjs');

const {Usuario} = require('../models');

const {generacionJWT, googleVerify} = require('../helpers');

const login = async (req = request, res = response) => {

    const {correo, password} = req.body;

    try{

        // Verificamos si existe un usuario con el correo ingresado.

        const usuario = await Usuario.findOne( {correo} );

        if (!usuario) {

            return res.status(400).json({

                msg: 'El correo / password son incorrectos',
            });
        };

        // Verificamos si el usuario se encuentra activo.

        if(!usuario.estado) {

            return res.status(400).json({

                msg: 'El correo / password son incorrectos',
            }); 
        };

        // Verificamos que la contraseña ingresada sea válida.

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword) {

            return res.status(400).json({

                msg: 'El correo / password son incorrectos',
            }); 
        };

        // Generamos el JWT.

        const token = await generacionJWT(usuario.id)

        res.json({

            usuario,
            token,
        });
    
    } catch (error) {

        console.log(error);

        return res.status(500).json({

            msg: 'Consulte al administrador',
        });
    };
};

const googleSingIn = async (req = request, res = response) => {

    const {id_token} = req.body;

    try{

        const {nombre, apellido, correo, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne( {correo} );

        if (!usuario) {

            const data = {
                nombre,
                apellido,
                correo,
                password: '-',
                img,
                google: true,
            };

            usuario = new Usuario(data);

            await usuario.save();
        };

        // Verificamos que el usuario autenticado con las credenciales de google,
        // no haya sido eliminado de nuestra base de datos.

        if (!usuario.estado) {

            return res.status(401).json({

                msg: 'Consulte con el administrador, usuario bloqueado.'
            });
        };

        // Generamos el JWT.

        const token = await generacionJWT(usuario.id);
        
        res.json({

            usuario,
            token,
        });

    } catch (error) {

        console.log(error)

        res.status(400).json({

            msg: 'Token de Google inválido.'
        });
    };
};

const renovarJWT = async (req = request, res = response) => {

    const usuario = req.usuarioAuth;

    // Renovamos el JWT.

    const token = await generacionJWT(usuario.id);

    res.json({

        usuario,
        token,
    });
};

module.exports = {

    login,
    googleSingIn,
    renovarJWT,
};