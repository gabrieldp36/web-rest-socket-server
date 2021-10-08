const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
    },

    estado: {
        type: Boolean,
        default: true,
        required: true,
    },

    precio: {
        type: Number,
        default: 0,
    },

    descripcion: { 
        type: String,
    },

    disponibilidad: {

        type:Boolean,
        default: true,
    },

    img: {
        type: String,
    },

    categoria: { 
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
});

ProductoSchema.methods.toJSON = function () {

    const {__v, _id, usuario: user, categoria: category, ...producto} = this.toObject();
    
    producto.producto_id = _id;

    const {_id: identificador, estado, ...categoria} = category;

    categoria.categoria_id = identificador;

    producto.categoria = categoria;

    const {_id: id, ...usuario} = user;

    usuario.uid = id

    producto.usuario = usuario;

    return producto;
};

module.exports = model('Producto', ProductoSchema);