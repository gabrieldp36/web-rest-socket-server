const {createServer} = require('http');

const express = require('express');

const cors = require('cors');

const fileUpload = require('express-fileupload');

const {dbConnection} = require('../database/config')

const {socketController} = require('../sockets/controller')

class Server {

    constructor () {

        this.app = express();

        this.port = process.env.PORT;

        this.server = createServer(this.app);

        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            busquedas: '/api/buscar',
            categorias: '/api/categorias',
            chat: '/chat',
            error401: '/401',
            error404: '*',
            logout: '/logout',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads',
        };

        // Conección a la base de datos.

        this.conectarDB();

        // Middlewares.

        this.middlewares();
        
        // Rutas de mi aplicación.

        this.routes();

        // Sockets.

        this.sockets();

        // Listen.

        this.listen();
    };

    async conectarDB () {

        await dbConnection();

    };

    middlewares () {

        // Cors.

        this.app.use( cors() );

        // Lectura y parseo del body.

        this.app.use( express.json() );

        // Directorio público.

        this.app.use( express.static ('public') );

        // FileUpload - Carga de archivos.

        this.app.use(fileUpload({

            useTempFiles : true,

            tempFileDir : '/tmp/',
        }));
    };

    routes () {

        this.app.use( this.paths.auth, require('../routes/auth') );

        this.app.use( this.paths.busquedas, require('../routes/busquedas') );

        this.app.use( this.paths.categorias, require('../routes/categorias') );

        this.app.use( this.paths.chat, require('../routes/chat') );

        this.app.use( this.paths.logout, require('../routes/cierre-sesion') );

        this.app.use( this.paths.productos, require('../routes/productos') );

        this.app.use( this.paths.uploads, require('../routes/uploads') );

        this.app.use( this.paths.usuarios, require('../routes/usuarios') );

        this.app.use( this.paths.error401, require('../routes/401') );

        this.app.use( this.paths.error404, require('../routes/404') );
    };

    sockets () {

        this.io.on("connection", (socket) => socketController(socket, this.io) );
    };

    listen() {
        
        this.server.listen(this.port, () => {

            console.log(`Servidor corriendo en http://localhost:${this.port}.`);
        });
    };
};

module.exports = Server;