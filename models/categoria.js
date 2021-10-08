const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
    },

    estado: {
        type: Boolean,
        default: true,
        required: true,
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
   
});

CategoriaSchema.methods.toJSON = function () {

    const {__v, _id, usuario: user, ...categoria} = this.toObject();
    
    categoria.categoria_id = _id;

    const {_id: id, ...usuario} = user;

    usuario.uid = id

    categoria.usuario = usuario;

    return categoria;
};

module.exports = model('Categoria', CategoriaSchema);
