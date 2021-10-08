class Mensaje {

    constructor (uid, nombre, apellido, mensaje) {

        this.fechaHora = this.fechaHoraMensaje();

        this.uid = uid;

        this.nombre = nombre;
        
        this.apellido = apellido;

        this.mensaje = mensaje;
    };

    fechaHoraMensaje() {

        let hoy = new Date();
        let dia = hoy.getDate();
        let mes = hoy.getMonth() + 1; // Enero es 0!
        let año = hoy.getFullYear();
        let hora = hoy.getHours();
        let minutos = hoy.getMinutes();

        if (dia < 10) {

            dia = '0' + dia;
        };

        if (mes < 10) {

            mes = '0' + mes;
        };

        return hoy = `${dia}/${mes}/${año}-${hora}:${minutos}`;
    };
};

class ChatMensajes {

    constructor () {

        this.ultimosDiezMensajes = [];

        this.ultimosDiezPrivados = [];

        this.usuarios = {};
    };
    
    get getUsuariosArr () {

        return Object.values(this.usuarios);
    };

    enviarMensaje (uid, nombre, apellido, mensaje) {

        if (this.ultimosDiezMensajes.length === 10) {

            this.ultimosDiezMensajes.shift();
        };

        this.ultimosDiezMensajes.push( new Mensaje(uid, nombre, apellido, mensaje) );
    };

    enviarMensajePrivado (uid, nombre, apellido, mensaje) {

        if (this.ultimosDiezPrivados.length === 10) {

            this.ultimosDiezPrivados.shift();
        };

        this.ultimosDiezPrivados.push( new Mensaje(uid, nombre, apellido, mensaje) );
    };

    conectarUsuario (usuario) {

        this.usuarios[usuario.id] = usuario;
    };

    desconectarUsuario(id) {

        delete this.usuarios[id];
    };
};

module.exports = ChatMensajes;