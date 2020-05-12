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
process.env.CADUCIDAD_TOKEN = '48h';


//
// SEED DE AUTENTICACION
//

process.env.SEED = process.env.SEED || 'este-es-el-sdeed-desarrollo';

//
// GOOGLE CLIENT
//

process.env.CLIENT_ID = process.env.CLIENT_ID || '768500050444-bvrhar3nmc6ncpcu8dghfrlp0m6uobll.apps.googleusercontent.com';
