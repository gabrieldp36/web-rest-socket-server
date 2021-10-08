const { isValidObjectId } = require('mongoose');

const {ObjectId} = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const ignorarCaracteresEspeciales = (texto = '') => {

    return texto.replace(/a/g, '[a\xC0-\xff]')
    .replace(/e/g, '[e\xC0-\xff]')
    .replace(/i/g, '[i\xC0-\xff]')
    .replace(/o/g, '[o\xC0-\xff]')
    .replace(/u/g, '[u\xC0-\xff]')
    .replace(/n/g, '[n\xC0-\xff]')
};

const buscarUsuario = async (termino, res) => {

    const isMongoID = isValidObjectId(termino);

    if (isMongoID) {

        const usuario = await Usuario.findById(termino);

        res.json({

            resultados: (!usuario) ?  ['No existe usuario.'] : ( (usuario.estado) ? [usuario] : ['El usuario no está activo.']),
        });

    } else if ( termino.toUpperCase() !== 'TOTAL' ) {

        const regex = RegExp(ignorarCaracteresEspeciales(termino), 'i');

        const [total, usuarios] = await Promise.all([

            Usuario.countDocuments({

                $or: [{nombre: regex}, {apellido: regex}, {correo: regex}, {rol: regex}],
                $and: [{estado:true}],
            }),
            Usuario.find({

                $or: [{nombre: regex}, {apellido: regex}, {correo: regex}, {rol: regex}],
                $and: [{estado:true}],
            }),
        ]);

        res.json({

            total,
            usuarios: (usuarios.length === 0) ?  ['No existen usuarios.'] : usuarios,
        });

    } else if ( termino.toUpperCase() === 'TOTAL' ) {

        const usuariosActivos = {estado: true};

        const [total, usuarios] = await Promise.all([

            Usuario.countDocuments(usuariosActivos),
            Usuario.find(usuariosActivos)
        ]);

        res.json({

            total,
            usuarios: (usuarios.length === 0) ?  ['No existen usuarios.'] : usuarios,
        });
    };
};

const buscarCategoria = async (termino, res) => {

    const isMongoID = isValidObjectId(termino);

    if (isMongoID) {

        const categoria = await Categoria.findById(termino).populate({path:'usuario', select: ['nombre', 'apellido']});

        res.json({

            resultados: (!categoria) ?  ['No existe categoría.'] : ( (categoria.estado) ? [categoria] : ['La categoría no está disponible.']),
        });

    } else if ( termino.toUpperCase() !== 'TOTAL' ) {

        const regex = RegExp(ignorarCaracteresEspeciales(termino), 'i');

        const [total, categorias] = await Promise.all([

            Categoria.countDocuments({nombre: regex, estado:true}),

            Categoria.find({nombre: regex, estado:true})
            .populate({path:'usuario', select: ['nombre', 'apellido']}),
        ]);

        res.json({

            total,
            categorias: (categorias.length === 0) ?  ['No existen categorías.'] : categorias,
        });
    
    } else if ( termino.toUpperCase() === 'TOTAL' ) {

        const categoriasActivas = {estado: true};
        
        const [total, categorias] = await Promise.all([

            Categoria.countDocuments(categoriasActivas),
            Categoria.find(categoriasActivas).populate({path:'usuario', select: ['nombre', 'apellido']}),
        ]);

        res.json({

            total,
            categorias: (categorias.length === 0) ?  ['No existen categorías.'] : categorias,
        });
    };
};

const buscarProductos = async (termino, res) => {

    const isMongoID = isValidObjectId(termino);

    if (isMongoID) {

        const producto = await Producto.findById(termino)
                            .populate('categoria', 'nombre')
                            .populate({path:'usuario', select: ['nombre', 'apellido']})

        res.json({

            resultados: (!producto) ?  ['No existe producto.'] : ( (producto.estado) ? [producto] : ['El producto no está disponible.']),
        });

    } else if ( termino.toUpperCase() !== 'TOTAL' ) {

        const regex = RegExp(ignorarCaracteresEspeciales(termino), 'i');
        
        const elementos = await Producto.find({nombre: regex, estado:true})
            .populate({path: 'categoria', select: ['nombre', 'estado']})
            .populate({path:'usuario', select: ['nombre', 'apellido']});

        let productos = elementos.filter( producto => producto.categoria.estado === true);

        res.json({

            total: productos.length,
            productos: (productos.length === 0) ?  ['No existen productos.'] : productos,
        });

    } else if ( termino.toUpperCase() === 'TOTAL' ) {

        const productosActivos = {estado: true};

        const elementos = await Producto.find(productosActivos)
                .populate({path: 'categoria', select: ['nombre', 'estado']})
                .populate({path:'usuario', select: ['nombre', 'apellido']})

        let productos = elementos.filter( producto => producto.categoria.estado === true);

        res.json({

            total: productos.length,
            productos: (productos.length === 0) ?  ['No existen productos.'] : productos,
        });
    };
};

const buscarCategoriasProductos = async (termino, res) => {

    const regex = RegExp(ignorarCaracteresEspeciales(termino), 'i');

    const isMongoID = isValidObjectId(termino);

    if (isMongoID) {

        const elementos = await Producto.find({categoria: ObjectId(termino), estado:true})
                            .populate({path: 'categoria', select: ['nombre', 'estado']})
                            .populate({path:'usuario', select: ['nombre', 'apellido']});

        let productos = elementos.filter( producto => producto.categoria.estado === true);

        return res.json({
            
            total: productos.length,
            resultados: (productos.length === 0) ?  ['No existen productos.'] : productos,
        });
    };

    const categorias = await Categoria.find({ nombre: regex, estado: true});

    if (categorias.length === 0) {

        return res.json({

            total: 0,
            resultados: ['No existen productos.'],
        });
    };
    
    const productos = await Producto.find({

        $or: [...categorias.map( categoria => ({

            categoria: categoria._id
        }))],

        $and: [{ estado: true }]

    })
    .populate('categoria', 'nombre')
    .populate({path:'usuario', select: ['nombre', 'apellido']});
 
    res.json({

        total: productos.length,
        resultados: (productos.length === 0) ?  ['No existen productos.'] : productos,
    });
};

module.exports ={

    buscarUsuario,
    buscarCategoria,
    buscarProductos,
    buscarCategoriasProductos,
};