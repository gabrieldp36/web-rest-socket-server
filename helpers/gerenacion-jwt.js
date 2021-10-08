const jwt = require('jsonwebtoken');

const generacionJWT = (uid) => {

    return new Promise( (resolve, reject) => { 

        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {

            expiresIn: '4h',

        }, (err, token) => {
            
            if (err) {

                console.log(erro);

                reject('No se pudo generar el token.');

            } else {

                resolve(token);
            };
        });
    });
};

module.exports = {
    
    generacionJWT,
};