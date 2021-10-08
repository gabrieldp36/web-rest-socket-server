const {comprobarJWT} = require('../helpers/comprobar-jwt-socket');

const ChatMensajes = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();

const socketController = async (socket, io) => {

    // Cuando un cliente se conecta.

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    
    if (!usuario) {

        return socket.disconnect()
    };

    // Conectamos al socket a una sala especial creada con su uid.

    socket.join(usuario.id);

    // Agregar al usuario conectado.

    chatMensajes.conectarUsuario(usuario);

    // Notificamos a los sockets el listado de usuarios activos.

    io.emit('usuarios-activos', chatMensajes.getUsuariosArr);

    // Notificamos al socket que se conecta los últimos diez mensajes del chat.

    socket.emit('recibir-mensaje', chatMensajes.ultimosDiezMensajes);

    // Notificamos al socket que se conecta los últimos diez mensajes privados.

    socket.emit('mensaje-privado', chatMensajes.ultimosDiezPrivados);

    // Desconectamos al usuario y lo removemos del listado de usuarios activos.

    socket.on('disconnect', () => {

        chatMensajes.desconectarUsuario(usuario.id);

        io.emit('usuarios-activos', chatMensajes.getUsuariosArr);
    });

    // Recepcionamos el mensaje enviado por el cliente y lo reenvíamos a todos los sockets.

    socket.on('enviar-mensaje', ( {uid, mensaje} ) => {

        if (uid) {

            chatMensajes.enviarMensajePrivado(uid, usuario.nombre, usuario.apellido, mensaje)

            socket.to(uid).emit('mensaje-privado', chatMensajes.ultimosDiezPrivados);

        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, usuario.apellido, mensaje);

            io.emit('recibir-mensaje', chatMensajes.ultimosDiezMensajes);
        };
    });
};

module.exports = {

    socketController
};