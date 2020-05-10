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
    urlDB = 'mongodb+srv://gonguty1987:gKPLS6RVbeYHkbCO@cluster0-0tygm.mongodb.net/cafe'
}

process.env.URLDB = urlDB;



