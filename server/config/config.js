//
//PUERTO
//
process.env.PORT = process.env.PORT || 3000;

//
//ENTORNO
//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';//si hay dato xq es de heroku, sino no lo llena y sale x dev


//
//BASE DE DATOS
//
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI; //sale del steo de variables de entornos de heroku
}

process.env.URLDB = urlDB;

//
// VENCIMIENTO DEL TOKEN
//
//
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//
// SEED DE AUTENTICACION
//

process.env.SEED = process.env.SEED || 'este-es-el-sdeed-desarrollo';


