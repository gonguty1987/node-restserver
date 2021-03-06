require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');//obtiene del modulo de node

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitamos la carppeta public para index
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },//Strign que viene x default
    (err, resp) => {

        if (err) throw new err;

        console.log('Base de datos online');

    });


app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto: ', process.env.PORT)
})