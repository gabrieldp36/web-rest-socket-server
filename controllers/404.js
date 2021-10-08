const path = require('path');

const {response, request} = require('express');

const controller404 = (req = request, res = response) => {

    const htmlPath = path.join(__dirname, '../public/404.html');

    res.sendFile(htmlPath);
};

module.exports = {

    controller404
};