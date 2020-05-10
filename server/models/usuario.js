//se encarga de trabajar el modelo de datos
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//validacion de claves

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido' //entre llaves va la inyeccion del rol q envia el usuario incorrectamente
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,//indicamos que es unico
        required: [true, 'el correo es necesario'],

    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

//se agrega metodo para que en la impresion del json no me aparesca el return del password
usuarioSchema.methods.toJSON = function () {//no se usa funcion de flecha xq necesitoo acceder al this

    let user = this; //lo que tiene en ese momentos
    let userObject = user.toObject(); //tengo todas las prop y metodos
    delete userObject.password; //elimina la pass

    return userObject;


}

//utiliza el plugin de clave unica, y le inyecta el path que es el email ->unique = true
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);
