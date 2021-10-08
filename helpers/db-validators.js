const {Role} = require('../models');

const {Usuario} = require('../models');

const existeUsuarioById = async (id) => {

    const existeUsuario = await Usuario.findById(id)

    if (!existeUsuario) {

        throw new Error(`El id ${id}, no existe.`);
    };

};

const esNombreValido = async ( nombre = '') => {

    const texto = nombre.trim();

    if (texto.length === 0) {

        throw new Error('El nombre es obligatorio.');
    };
};

const esApellidoValido = async ( apellido = '') => {

    const texto = apellido.trim();

    if (texto.length === 0) {

        throw new Error('El apellido es obligatorio.');
    };
};

const esRolValidoPost = async (rol = '') => {

    const existeRol = await Role.findOne({rol});

    if (rol.length === 0) {

        throw new Error('El rol es obligatorio.');

    } else if (!existeRol && rol.length > 0) {

        throw new Error(`El rol ${rol} no se encuentra registrado en la base de datos.` );
    };
};

const validacionEmailPost= async (correo = '') => {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const existeCorreo = await Usuario.findOne( {correo} );

    if (correo.length === 0) {

        throw new Error('El correo es obligatorio.');

    } else if (existeCorreo) {

        throw new Error(`El e-mail: ${correo}, ya se encuentra registrado.`);

    } else if (!existeCorreo) {
    
        if ( correo.length > 0 && !emailRegex.test(correo) ) {

            throw new Error('El correo ingresado no es válido.');
        };
    };
};

const passwordPost = async ( password = '' ) => {

    validarPassword(password);
};

const validacionEmailPut= async (correo = '') => {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const existeCorreo = await Usuario.findOne( {correo} );

    if (existeCorreo) {

        throw new Error(`El e-mail: ${correo}, ya se encuentra registrado.`);

    } else if (!existeCorreo) {
    
        if ( correo.length > 0 && !emailRegex.test(correo) ) {

            throw new Error('El correo ingresado no es válido.');

        };
    };
};

const esRolValidoPut = async (rol = '') => {

    const existeRol = await Role.findOne( {rol} );

    if (!existeRol && rol.length > 0) {

        throw new Error(`El rol ${rol} no se encuentra registrado en la base de datos.`);

    };
};

const passwordPut = async (password = '') => {

    if (password.length > 0 ) {

        validarPassword(password);
    };  
};

const esEstadoValidoPut = async (estado) => {

    if (estado === undefined) {

        return;

    } else if ( !(estado === true) || (estado === false) || estado.length === 0 ) { 

        throw new Error('Mediante una petición de tipo PUT, el estado solo puede ser actualizado a true.');

    };
};

const validarPassword = ( password = '' ) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if ( !passwordRegex.test(password) ) {

        throw new Error('La contraseña debe contener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula y un número, sin caracteres especiales.');

    };
};

const validacionEmailAuth= async (correo = '') => {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (correo.length === 0) {

        throw new Error('El correo es obligatorio.');

    } else if ( correo.length > 0 && !emailRegex.test(correo) ) {

        throw new Error('El correo ingresado no es válido.');
    };
};

module.exports = {

    existeUsuarioById,
    esNombreValido,
    esApellidoValido,
    esRolValidoPost,
    validacionEmailPost,
    passwordPost,
    validacionEmailPut,
    esRolValidoPut,
    passwordPut,
    esEstadoValidoPut,
    validacionEmailAuth,
};