// Referencias Htmml.

const formulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') ) 
            ? `http://localhost:${window.location.port}/`
            : `https://web-rest-socket-server.herokuapp.com/`;

// Login manual.

formulario.addEventListener('submit', event => {

    event.preventDefault();

    const formData = {};

    for (let element of formulario.elements ) {

        if (element.name.length > 0){

            formData[element.name] = element.value;
        };
    };

    fetch( url + 'api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then ( response => response.json() )
    .then( ( {errors, msg, token} ) => {

        if (errors) {

            const [mensaje1, mensaje2] = errors;

            if (errors.length === 1) {

                return alert(`${mensaje1.msg}`)
            };

            if (errors.length > 1) {

                return alert(`${mensaje1.msg} ${mensaje2.msg}.`)
            };
        };

        if (msg) {

           return alert('El correo / password son incorrectos.');
        };

        localStorage.setItem('token',token);

        window.location = url + 'chat';

    }).catch( error => {

        console.log(error);
    });
});

// Login con Google Sign In.

onSuccess = function (googleUser) {

    // var profile = googleUser.getBasicProfile();

    // console.log('ID: ' + profile.getId());
    // console.log('Nombre: ' + profile.getGivenName());
    // console.log('Apellido: ' + profile.getFamilyName());
    // console.log('Imagen URL: ' + profile.getImageUrl());
    // console.log('Correo: ' + profile.getEmail());

    var id_token = googleUser.getAuthResponse().id_token;

    const data = {id_token}

    fetch(url + 'api/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
    })
    .then ( response => response.json() )
    .then ( ( {token} ) => {

        localStorage.setItem('token', token);

        window.location = url + 'chat';
    })
    .catch(console.log);
};

onFailure = function (error) {

    console.log(error);
};

renderButton = function () {

    gapi.signin2.render('my-signin2', {
        
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
};

function signOut() {

    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {

        localStorage.removeItem('token');

        console.log('Usuario desconectado.');
    });
};

const anchorSingOut = document.getElementById('logout-google');

anchorSingOut.addEventListener('click', () => signOut() );