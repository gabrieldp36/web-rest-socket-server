const path = require('path');

const {response, request} = require('express');

const controller401 = (req = request, res = response) => {

    const htmlPath = path.join(__dirname, '../public/401.html');

    res.sendFile(htmlPath);
};

module.exports = {

    controller401
};