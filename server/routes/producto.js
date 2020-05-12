const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');//todas las peticiones necesitams token

const app = express();

const Producto = require('../models/producto');//se crea la variable en mayuscula xq es un standard para indiciar el new

//MOSTRAR TODAS LOS PRODUCTOS
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')//revisa que id object existe y permite cargar informacion de otra tabla
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })



});

//MOSTRAR 1 PRODUCTOS
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err: {
                        message: 'el id no existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })

        })

});

//buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');//manda la expresion regular

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })


        })

});




//CREAR UN NUEVO PRODUCTO
app.post('/producto', verificaToken, function (req, res) {

    let body = req.body;//obtengo el body del request

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productoDB => {

        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })


    }))



});

//ACTUALIZAR PRODCUTO
app.put('/producto/:id', verificaToken, function (req, res) {

    let id = req.params.id;//obtengo el id a modificar
    let body = req.body;

    //otra forma de guardar
    Producto.findById(id, (err, productoDB) => {
        //runValidators corre las validaciones del modelo

        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({ //error de xq no creo la categoria
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descricion = body.descricion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        })

    })

})

//ELIMINAR PRODCUTO
app.delete('/producto/:id', verificaToken, function (req, res) {

    let id = req.params.id;

    //actualiza el estado
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err
            })
        };

        if (!productoBorrado) {
            return res.status(400).json({ //status son los mensajes codigo de error http
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto Borrado'
        })

    })

})

module.exports = app;