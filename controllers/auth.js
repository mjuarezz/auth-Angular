const { response } = require('express');
const Usuario = require('../models/Usuario'); 
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario =  async(req, res = response) => {

    const { email, name, password} = req.body

    try {
        
        // Verificar email unique
        const usuario = await Usuario.findOne({ email } );

        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hash password
        const salt = bcrypt.genSaltSync( 10 );
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // Crear usuario de BD
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contactar con el administrador'
        });
        
    }
}

const loginUsuario = async (req, res = response ) => {
    const {email,password} = req.body
    console.log( email, password );

    try {
        // busca usuario en la DB
        const dbUser = await Usuario.findOne({ email });        
        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña invalido U'
            });
        } 

        // Validar la contraseña
        const validPassword = bcrypt.compareSync( password, dbUser.password )
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña invalido P'
            });
        } 

        // Generar JWT
        const token = await generarJWT( dbUser.id, dbUser.name );
        
        // Generar respuesta exitosa
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contactar con el administrador'
        });        
    }


}

const revalidarToken = async (req, res  = response ) => {
    const { uid, name } = req;

    // busca usuario en la DB
    const dbUser = await Usuario.findById( uid );      
    if( !dbUser ) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario o contraseña invalido T'
        });
    } 

    // Generar JWT
    const token = await generarJWT( uid, name );

    return res.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        token
    });

}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
