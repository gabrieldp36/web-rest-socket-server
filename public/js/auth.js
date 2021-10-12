// Referencias Htmml.

const formulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') ) 
            ? `http://localhost:${window.location.port}/`
            : `https://web-rest-socket-server.herokuapp.com/`;

const googleClientID = '778480152819-frrdc59gqm61ldn9lj8db7l0qn2l8gm1.apps.googleusercontent.com';

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

function handleCredentialResponse(response) {
    
    const body = {
        id_token: response.credential
    };

    fetch(url + 'api/auth/google', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
        })
        .then ( response => response.json() )
        .then ( ( data ) => {

            const token = data.token;

            const correo = data.usuario.correo;
    
            localStorage.setItem('token', token);

            localStorage.setItem('correo', correo);
    
            window.location = url + 'chat';
        })
        .catch(console.log);
};

window.onload = function () {

    google.accounts.id.initialize({

      client_id: googleClientID,

      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(

      document.getElementById('buttonDiv'),
      
      {
        type:'standard',
        size:'large',
        theme: 'filled_blue', 
        text:'signin_with',
        shape:'circle',
        logo_alignment:'left',
        width: '275',}
    );
};

 const signOut =  () => {

    google.accounts.id.disableAutoSelect();
    
    google.accounts.id.revoke(localStorage.getItem('correo'), () => {

        localStorage.clear();

        (function () {
            var cookies = document.cookie.split("; ");
            for (var c = 0; c < cookies.length; c++) {
                var d = window.location.hostname.split(".");
                while (d.length > 0) {
                    var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                    var p = location.pathname.split('/');
                    document.cookie = cookieBase + '/';
                    while (p.length > 0) {
                        document.cookie = cookieBase + p.join('/');
                        p.pop();
                    };
                    d.shift();
                }
            }
        })();
        

        location.reload();
    });
};

const anchorSingOut = document.getElementById('logout-google');

anchorSingOut.addEventListener('click',  () => signOut() );