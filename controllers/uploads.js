const path = require('path');

const fs = require('fs');

const {response, request} = require('express');

const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const {existeUsuarioProductoPorId} = require('../helpers')

const {subirArchivo, subirImagen, validarExtension} = require('../helpers/subir-archivo');

const cargarArchivo = async (req = request, res = response) =>{

    const extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif', 'txt', 'md', 'pdf'];

    subirArchivo(res, req, extensionesPermitidas);
};

// const actualizarImagen = async (req = request, res = response) => {

//     const {coleccion} = req.params;

//     try {

//         const modelo = await existeUsuarioProductoPorId(req);
        
//         // Limpiar imágenes previas del servidor.

//         if (modelo.img) {

//             const imagenPath = path.join(__dirname, '../uploads/img', coleccion, modelo.img);

//             if ( fs.existsSync(imagenPath) ) {

//                 fs.unlinkSync(imagenPath);
//             };
//         };

//         const extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

//         const nombre = await subirImagen(req, extensionesPermitidas);

//         modelo.img = nombre;

//         await modelo.save();

//         res.status(201).json(modelo);

//     } catch(msg) {
        
//         res.status(400).json({msg});
//     };
// };

const actualizarImagenCloudinary = async (req = request, res = response) => {

    try {

        const extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

        const {tempFilePath} = req.files.archivo;

        const modelo = await existeUsuarioProductoPorId(req);
        
        // Limpiar imágenes previas de Clouddinary.

        if (modelo.img) {

            const nombreArray = modelo.img.split('/');

            const nombre = nombreArray[nombreArray.length - 1];

            const [public_id] = nombre.split('.');

            cloudinary.uploader.destroy(public_id);
        };

        const [, responseCloudinary] = await Promise.all([

            await validarExtension(req, extensionesPermitidas),

            await cloudinary.uploader.upload(tempFilePath),
        ]);

        const {secure_url} = responseCloudinary;

        modelo.img = secure_url;

        await modelo.save();

        res.status(201).json(modelo);

    } catch(msg) {

        console.log(msg)
        
        res.status(400).json({msg});
    };
};

// const mostarImagen = async (req = request, res = response) => {

//     const {coleccion} = req.params;

//     try {

//         const modelo = await existeUsuarioProductoPorId(req);

//         if (modelo.img) {

//             const imagenPath = path.join(__dirname, '../uploads/img', coleccion, modelo.img);

//             if ( fs.existsSync(imagenPath) ) {

//                return res.sendFile(imagenPath);
//             };
//         };

//         const noImgPath = path.join(__dirname, '../assets/no-image.jpg');

//         res.sendFile(noImgPath);
        
//     } catch(msg) {
        
//         res.status(400).json({msg});
//     };
// };

const mostarImagenCloudinary = async (req = request, res = response) => {

    try {

        const modelo = await existeUsuarioProductoPorId(req);

        if (modelo.img) {

            return res.redirect(modelo.img);
        };

        const noImgPath = path.join(__dirname, '../assets/no-image.jpg');

        res.sendFile(noImgPath);
        
    } catch(msg) {

        res.status(400).json({msg});
    };
};

module.exports = {

    cargarArchivo,
    actualizarImagenCloudinary,
    mostarImagenCloudinary,
};