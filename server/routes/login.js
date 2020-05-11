//Se crea para las rutas de los servicios
const express = require('express');

const bcrypt = require('bcrypt');//para encripptar contraseñas

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');//se crea la variable en mayuscula xq es un standard para indiciar el new

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {//verifico si el email existe

        if (err) {
            return res.status(500).json({ //status son los mensajes codigo de error http
                ok: false,  //error en la conexion con la bd
                err
            })
        }
        //verificar existe de email y usuario
        if (!usuarioDB) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err: {
                    message: 'usuario o contraseña incorrectos'
                }
            })
        }

        //verificar el tema de la password
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {//devuelve true o false

            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err: {
                    message: 'usuario o contraseña incorrectos'
                }
            })
        }

        //definimos la generacion del token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });//expira en 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

});

module.exports = app;