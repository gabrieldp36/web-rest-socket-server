// Referencias Html.

const alertOn = document.querySelector('#alertOn');

const alertOf = document.querySelector('#alertOf');

const txtUid = document.querySelector('#txtUid');

const txtMensaje = document.querySelector('#txtMensaje');

const ulUsuarios = document.querySelector('#ulUsuarios');

const ulMensajes = document.querySelector('#ulMensajes');

const ulChatsPrivados = document.querySelector('#ulChatsPrivados');

const btnSalir = document.querySelector('#btnSalir');

const usuariosContador = document.querySelector('#usuariosContador');

const url = ( window.location.hostname.includes('localhost') ) 
? `http://localhost:${window.location.port}/`
: `https://restserver-node-gdp.herokuapp.com/`;

let usuario = null;

let socket = null;

const validarRenovarJWT = async () => {

    try {

        const token = localStorage.getItem('token');

        if (!token) {

            alert('No hay token en la aplicación');

            window.location = url + '401';

            return;
        };

        const response = await fetch(url + 'api/auth/', {

            headers: {'x-token': token},
        });

        const {msg, usuario: usuarioDB, token: tokenDB} = await response.json();

        if (msg) {

            alert(msg);

            window.location = url + '401';

            return;
        };

        localStorage.setItem('token', tokenDB);
        
        usuario = usuarioDB;

        document.title = `${usuario.nombre} ${usuario.apellido}`;

        await conectarSocket();

    } catch (error) {

        console.log(error);
    };
};

const conectarSocket = async () => {
    
    socket = io({

        'extraHeaders': {

            'x-token': localStorage.getItem('token'),
        },
    });

    socket.on('connect', () => {

        alertOn.innerHTML = `<span> <strong>Servidor: Online</strong> </span>`;

        alertOn.classList.add('alert', 'alert-success', 'mt-2', 'col-md-2');
    });

    socket.on('disconnect', () => {

        alertOn.innerHTML = `<span> <strong>Servidor: Offline</strong> </span>`;

        alertOn.classList.add('alert', 'alert-danger', 'mt-2', 'col-md-2');
    });

    socket.on('recibir-mensaje', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarMensajesPrivados);
};

const dibujarUsuarios = ( usuarios = []) => {

    let usuariosHtml = '';

    usuarios.forEach( usuario => {

        usuariosHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${usuario.nombre} ${usuario.apellido}. </h5>
                    <span class="fs-6 text-muted"> ${usuario.uid} </span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usuariosHtml;

    if (usuarios.length === 0) {

        usuariosContador.innerText = usuarios.length;

        usuariosContador.classList.add('text-danger');

    } else {

        usuariosContador.innerText = usuarios.length;

        usuariosContador.classList.add('text-success');
    };
};

const dibujarMensajes = ( mensajes = []) => {

    let mensajesHtml = '';

    mensajes.forEach( ( {nombre, apellido, mensaje, fechaHora} ) => {

        mensajesHtml += `
            <li>
                <p align="justify" style="word-wrap: break-word;">
                    <span class="text-success">${fechaHora}</span>
                    <span class="text-primary"> | ${nombre} ${apellido}: </span>
                    <span> ${mensaje} </span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
};

const dibujarMensajesPrivados = (mensajesPrivados) => {

    let mensajesHtml = '';

    const mensajesFiltrados = mensajesPrivados.filter( mensaje => mensaje.uid === usuario.uid);

    mensajesFiltrados.forEach( ( {nombre, apellido, mensaje, fechaHora} ) => {

        mensajesHtml += `
            <li>
                <p align="justify" style="word-wrap: break-word;">
                    <span class="text-success">${fechaHora}</span>
                    <span class="text-primary"> | ${nombre} ${apellido}: </span>
                    <span> ${mensaje} </span>
                </p>
            </li>
        `;
    });

    ulChatsPrivados.innerHTML = mensajesHtml;
};

txtMensaje.addEventListener('keyup', ( {keyCode} ) => {

    const mensaje = txtMensaje.value.trim();

    const uid = txtUid.value;

    if (keyCode !== 13) {

        return;

    } else if(mensaje.length === 0) {

        return;
    };

    socket.emit('enviar-mensaje', ( {uid, mensaje} ) );

    txtMensaje.value = '';
});

btnSalir.addEventListener('click', () => {

    localStorage.removeItem('token');

    window.location = url + 'logout';
});

const main = async () => {

    await validarRenovarJWT();
};

main();


