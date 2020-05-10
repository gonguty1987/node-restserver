require('./config/config');

const express = require('express')
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario')); //se llama  a las rutas de usuarios de los servicios

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },//Strign que viene x default
    (err, resp) => {

        if (err) throw new err;

        console.log('Base de datos online');

    });


app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto: ', process.env.PORT)
})