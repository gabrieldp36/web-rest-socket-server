const path = require('path');

const {response, request} = require('express');

const cerrarSesion = (req = request, res = response) => {

    const htmlPath = path.join(__dirname, '../public/logout.html');

    res.sendFile(htmlPath);
};

module.exports = {

    cerrarSesion
};