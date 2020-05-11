const jwt = require('jsonwebtoken');

//-------------
//verificar token
//-------------

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //obtengo el header del request,propiedad token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: true,
                err: 'token no válido'
            });//no autorizado
        }

        req.usuario = decoded.usuario;//payload

        next();//para que siga ejecutandose el codigo

    });


};

//-------------
//verificar admin role
//-------------
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });//no autorizado
    }


}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}