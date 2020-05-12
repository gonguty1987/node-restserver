const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');//se crea la variable en mayuscula xq es un standard para indiciar el new
const Producto = require('../models/producto');//se crea la variable en mayuscula xq es un standard para indiciar el new

const fs = require('fs');//filse system de node
const path = require('path');//paraobtener el path de las imagenes

app.use(fileUpload({ useTempFiles: true }));//middleware,todos los archivos que se carguen vienen en req.files

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //no hay archivo
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            })
    }

    //validar tipo
    let tiposValidos = ['usuario', 'producto'];

    if (tiposValidos.indexOf(tipo) < 0) {//no encuentra la extension en el arreglo

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son:' + tiposValidos.join(', '),
                tipo
            }
        });

    }


    //viene archivo
    let archivo = req.files.archivo;
    //recuperar extensinones
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //validar tipo de archivos o extensiones
    let extensionesValidadas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidadas.indexOf(extension) < 0) {//no encuentra la extension en el arreglo

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son:' + extensionesValidadas.join(', '),
                ext: extension
            }
        });

    }

    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // mueve el archivo al reposiitorio del server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        //la imagen ya esta en el filesystem
        if (tipo === 'usuario') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);

        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuario');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuario');

            return res.status(400).json({
                ok: false,
                err:
                {
                    message: 'el usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuario');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        })

    })

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'producto');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'producto');

            return res.status(400).json({
                ok: false,
                err:
                {
                    message: 'el producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'producto');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })

    })

}

function borraArchivo(nombreImagen, tipo) {
    //verificar si existe la imagen en el filse system
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImagen))//true si existe o false si no existe
    {
        fs.unlinkSync(pathImagen);//elimina imagen
    }
}


module.exports = app;