//Se crea para las rutas de los servicios
const express = require('express');

const bcrypt = require('bcrypt');//para encripptar contraseñas

const jwt = require('jsonwebtoken');

//validaciones de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//Configuracion de google
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({ //status son los mensajes codigo de error http
                ok: false,  //error en la conexion con la bd
                err
            })
        }

        //verificar existe de email y usuario
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({ //status son los mensajes codigo de error http
                    ok: false,  //error en la conexion con la bd
                    err: {
                        message: 'Debe usuar su autenticacion normal'
                    }

                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });//expira en 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }
        else {
            //si el usuario no existe en la bd
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({ //status son los mensajes codigo de error http
                        ok: false,  //error en la conexion con la bd
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });//expira en 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })

        }

    })

});

module.exports = app;