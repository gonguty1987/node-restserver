//Se crea para las rutas de los servicios
const express = require('express');
const bcrypt = require('bcrypt');//para encripptar contraseñas
const _ = require('underscore'); //validaciones de datos a actualizar

const Usuario = require('../models/usuario');//se crea la variable en mayuscula xq es un standard para indiciar el new

const app = express();

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limit || 5;
    limite = Number(limite);

    //dentro del find van los usuarios activos
    Usuario.find({ estado: true }, 'nombre email role estado google img') //el find es el where de sql, nomrabmos los campos que queremos qe se visualice
        .skip(desde)//salteo de registros
        .limit(limite)//trae la cantidad de registros
        .exec((err, usuarios) => { //exec ejecuta la funcion

            if (err) {
                return res.status(400).json({ //status son los mensajes codigo de error http
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => { //cuenta la cantidad de rgistros del esquema

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })



        });

});

app.post('/usuario', function (req, res) {

    let body = req.body; //se usa  body parser al toque, lo refactoriza. body parser procesa payload

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),//encriptar
        role: body.role

    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err
            })
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    });

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    //de lo que recibo en el body,indico los que se pueden modificar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        //runValidators corre las validaciones del modelo

        if (err) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })


});

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    //borra fisicamente de la bd
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //actualiza el estado
    let cambiaEstado = {
        estado: fasle
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err
            })
        };

        if (!usuarioBorrado) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })


});

module.exports = app;