const {response} = require('express');
const Event = require("../models/Evento");
const Evento = require('../models/Evento');


const getEventos = async(req, res = response) => {


    try {

        const eventos = await Evento.find().populate('user', 'name');

        return res.status(200).json({
            ok:true,
            eventos
        })
        
    } catch (error) {

        console.log(error)
        
       return res.status(500).json({
         ok:false,
         msg: `Error de obtencion de eventos,  ${error}`
       })
    }


}


const crearEvento = async(req, res = response) => {


    const event = new Event(req.body);


    try {

        event.user = req.uid;

        const eventSave = await event.save();

        return res.status(200).json({
            ok:true,
            evento: eventSave
        })
        
    } catch (error) {

        console.log(error)
        
       return res.status(500).json({
         ok:false,
         mmsg: `Error de creacion de evento,  ${error}`
       })
    }
}


const actualizarEvento = async(req, res = response) => {


    const eventId = req.params.id;
    const uid = req.uid;
    console.log("eventoId",eventId)

    try {

        const event = await Evento.findById(eventId);

        if(!event){
           return res.status(404).json({
                ok:false,
                msg: 'Evento no existe por este id'
            })
        }

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento, {new:true});


        return res.status(200).json({
            ok:true,
            evento: eventoActualizado
        })
        
    } catch (error) {

        console.log(error)
        
       return res.status(500).json({
         ok:false,
         msg: `Error de actualizacion de evento,  ${error}`
       })
    }

}


const eliminarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Evento.findById(eventId);

        if(!event){
           return  res.status(404).json({
                ok:false,
                msg: 'Evento no existe por este id'
            })
        }

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }
    
        await Evento.findByIdAndDelete(eventId);

        return res.status(200).json({
            ok:true,
            msg: 'Evento eliminado '
        })

        
    } catch (error) {

        console.log(error)

       return res.status(500).json({
         ok:false,
         msg: `Error de eliminacion de evento,  ${error}`
       })
    }

}



module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}