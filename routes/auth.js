
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear un nuevo usuario
router.post('/new',[
    check('email','El email es obligatorio').isEmail(),
    check('name','El name es obligatorio').not().isEmpty(),
    check(  'password',
            'El password es obligatorio y con longitud minima de 6 caracteres')
            .isLength({min:6}),
    validarCampos
], crearUsuario);

// Login de un usuario
router.post('/', [
    check('email','El email es obligatorio').isEmail(),
    check(  'password',
            'El password es obligatorio y con longitud minima de 6 caracteres')
            .isLength({min:6}),
    validarCampos
 ] ,loginUsuario);

// validar y revalidar token
router.get('/renew',validarJWT, revalidarToken);








module.exports = router;

