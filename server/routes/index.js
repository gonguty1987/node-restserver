const express = require('express')

const app = express();

app.use(require('./usuario')); //se llama  a las rutas de usuarios de los servicios
app.use(require('./login')); //se llama  a las rutas de login de los servicios
app.use(require('./categoria')); //se llama  a las rutas de categoria de los servicios
app.use(require('./producto')); //se llama  a las rutas de producto de los servicios


module.exports = app;