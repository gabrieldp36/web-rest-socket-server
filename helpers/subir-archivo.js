const path = require('path');

const { v4: uuidv4 } = require('uuid');

const {Producto, Usuario} = require('../models');

const subirArchivo = (res, req, extensionesPermitidas) => {

    const destino = req.header('destino');

    const destinosPermitidos = ['usuarios', 'productos', 'archivos'];

    if (!destino) {

        return res.status(401).json({

            msg: 'No se ha enviado un destino en la petición',
        });
    };

    if ( !destinosPermitidos.includes(destino) ) {

        return res.status(401).json({

            msg: 'Sólo se admiten los siguientes destinos: usuarios, productos o archivos.',
        });
    };

    const {archivo}= req.files;

    // Validamos la extensión.
   
    const nombreCortado = archivo.name.split('.');
   
    const extension = nombreCortado[nombreCortado.length - 1];
   
    if ( !extensionesPermitidas.includes(extension) ) {
   
        return res.status(400).json({
            
            msg: `La extensión ${extension} no está permitida. Sólo se admiten las siguientes extensiones: ${extensionesPermitidas}.`,
        });
    };
   
    // Renombramos el archivo.
   
    const nombreFinal = uuidv4() + '.' + extension;
   
    let uploadPath = '';
   
    // Movemos el archivo al directorio especificado.

    const extensionesUsuariosProductos = ['png', 'jpg', 'jpeg', 'gif'];

    const extensionesDestinoArchivos = ['txt', 'md', 'pdf'];

    if ( (destino === 'usuarios' || destino === 'productos') && (!extensionesUsuariosProductos.includes(extension)) ) {

        return res.status(400).json({
            
            msg: `El destino ${destino} sólo admite las siguientes extensiones: png, jpg, jpeg o gif.`,
        });

    } else if ( (destino === 'usuarios' || destino === 'productos') ) {
        
        uploadPath = path.join(__dirname, '../uploads/img', destino, nombreFinal);

    } else if ( (destino === 'archivos') && (!extensionesDestinoArchivos.includes(extension)) ){

        return res.status(400).json({
            
            msg: `El destino ${destino} sólo admite las siguientes extensiones: txt, md, pdf.`,
        });
        
    } else if ( (extension === 'pdf') ) {

        uploadPath = path.join(__dirname, '../uploads', destino, '/pdf', nombreFinal);
    
    } else if ( (extension === 'txt' || extension === 'md') ) {

        uploadPath = path.join(__dirname, '../uploads', destino, '/texto', nombreFinal);
    };
   
    archivo.mv(uploadPath, (error) => {
   
        if (error) {
            
            return res.status(500).json({error});
        };
    });
    
    res.status(201).json({nombre_Archivo: nombreFinal});
                         
    return nombreFinal;
};

const existeUsuarioProductoPorId = (req) => {

    return new Promise ( async (resolve, reject) => {

        const {coleccion, id} = req.params;

        let modelo;

        switch(coleccion) {

            case 'usuarios':
            
                modelo = await Usuario.findById(id);

                if (!modelo) {

                    return reject(`No existe un usuario con el id ${id}`);
                };

            break;

            case 'productos':

                modelo = await Producto.findById(id)
                            .populate('categoria', 'nombre')
                            .populate({path:'usuario', select: ['nombre', 'apellido']});

                if (!modelo) {

                    return reject(`No existe un producto con el id ${id}`);
                };

            break;

            default: reject(`No se ha implementado un procedimiento de actualización de imágenes para la colección ${coleccion}`);
        };
        
        resolve(modelo);
    });
};

const subirImagen = (req, extensionesPermitidas) => {

    return new Promise ( (resolve, reject) => {

        const {coleccion} = req.params;

        const {archivo}= req.files;

        // Validamos la extensión.
       
        const nombreCortado = archivo.name.split('.');
       
        const extension = nombreCortado[nombreCortado.length - 1];
       
        if ( !extensionesPermitidas.includes(extension) ) {
       
            return reject(`La extensión ${extension} no está permitida. Sólo se admiten las siguientes extensiones: ${extensionesPermitidas}.`)
        };
       
        // Renombramos el archivo.
       
        const nombreFinal = uuidv4() + '.' + extension;
       
        let uploadPath = '';
       
        // Movemos el archivo al directorio especificado.

        uploadPath = path.join(__dirname, '../uploads/img', coleccion, nombreFinal);

        archivo.mv(uploadPath, (error) => {
   
            if (error) {
                
                reject(error);
            };

            resolve(nombreFinal)
        });
    });
};

const validarExtension = (req, extensionesPermitidas) => {

    return new Promise ( (resolve, reject) => {

        const {archivo}= req.files;
    
        const nombreCortado = archivo.name.split('.');
    
        const extension = nombreCortado[nombreCortado.length - 1];
    
        if ( !extensionesPermitidas.includes(extension) ) {
    
            reject(`La extensión ${extension} no está permitida. Sólo se admiten las siguientes extensiones: ${extensionesPermitidas}.`)
        };

        resolve();
    });
};

module.exports = {

    subirArchivo,
    existeUsuarioProductoPorId,
    subirImagen,
    validarExtension,
};
