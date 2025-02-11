const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    
    //manejo de errores

    const {email, password} = req.body;

    try{

        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este correo'});
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'});

    }

};

const loginUsuario = async(req, res = response) => {


    const {email, password} = req.body;


    try{
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con este correo'});
        }

        //Confirmar los passwords

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'});
        }

        //Generar JWT

        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
            

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'});

    }
}

const revalidarToken = async(req, res = response) => {

    const {uid, name} = req;

    //generar un nueevo JWT y retonarlo en esta peticion

    const token = await generarJWT(uid, name);


    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}