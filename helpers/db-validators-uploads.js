const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    if ( !colecciones.includes(coleccion) ) {

        throw new Error (`La colección ${coleccion} no se encuentra permitida. Sólo se aceptan las siguientes colecciones: ${colecciones}`);
    };

    return true;
};

module.exports = {

    coleccionesPermitidas,
};