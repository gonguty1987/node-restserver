const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');//todas las peticiones necesitams token

const app = express();

const Categoria = require('../models/categoria');//se crea la variable en mayuscula xq es un standard para indiciar el new

//MOSTRAR TODAS LAS CATEGORIAS
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email')//revisa que id object existe y permite cargar informacion de otra tabla
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({ //erroor en la conexion con la bd
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })


})

//MOSTRAR UNA CATEGORIA
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

//CREAR UNA NUEVA CATEGORIA
app.post('/categoria', verificaToken, function (req, res) {

    let body = req.body;//obtengo el body del request

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB => {

        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({ //error de xq no creo la categoria
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    }))



})

//ACTUALIZAR CATEGORIA
app.put('/categoria/:id', verificaToken, function (req, res) {

    let id = req.params.id;//obtengo el id a modificar
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }//lo que qers modificar

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        //runValidators corre las validaciones del modelo

        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({ //error de xq no creo la categoria
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })


});



//ELIMINAR CATEGORIA

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

    let id = req.params.id;

    //borra fisicamente de la bd
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        //actualiza el estado
        /*let cambiaEstado = {
            estado: fasle
        }*/

        // Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({ //erroor en la conexion con la bd
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({ //error de xq no creo la categoria
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    })

})

module.exports = app;