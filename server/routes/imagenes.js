//Se crea para las rutas de los servicios
const express = require('express');
const fs = require('fs');//filse system de node
const path = require('path');//paraobtener el path de las imagenes

const { verificaTokenImg } = require('../middlewares/autenticacion');
const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    if (fs.existsSync(pathImagen))//true si existe o false si no existe
    {
        res.sendFile(pathImagen);
    } else {

        let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagePath);
    }


})


module.exports = app;