/**
 * Evento Routes
 *  /api/events
 */

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')
const router = Router();
const { check } = require("express-validator");
const {validarCampos} = require("../middlewares/validar-campos")
const {isDate} = require("../helpers/isDate")
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')


//Todas tienen que pasar por la validacion del JWT
router.use(validarJWT);


// Obtener eventos
router.get('/', 
     getEventos)

// Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento)

// Actulizar evento
router.put('/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
 actualizarEvento)

// Borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router
