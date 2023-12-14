import { Router } from 'express';
import passport from 'passport';
import UserModel from '../../models/user.model.js';
import { createHash, isValidPassword } from '../../utils.js'

const router = Router();

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    // const {
    //     body: {
    //         first_name,
    //         last_name,
    //         email,
    //         password,
    //         age
    //     },
    // } = req;

    // const notCreated = await UserModel.findOne({ email });
    // if (notCreated) {
    //     return res.render('error', ({ title: 'Register | Ecommerce', messageError: 'Ya existe un usuario registrado con ese correo.' }))
    // }

    // if (
    //     !first_name ||
    //     !last_name ||
    //     !email ||
    //     !password
    // ) {
    //     return res.render('error', ({ title: 'Register | Ecommerce', messageError: 'Todos los campos son requeridos.' }))
    // }

    // const user = await UserModel.create({
    //     first_name,
    //     last_name,
    //     email,
    //     password,
    //     age,
    // });

    // // res.status(201).json({ message: 'Se ha creado el usuario.', user })
    // res.redirect('/profile')

    console.log('req.user', req.user);
    res.redirect('/profile');

})


router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    // const { body: { email, password } } = req;
    // if (!email || !password) {
    //     return res.render('error', ({ title: 'Login | Ecommerce', messageError: 'Todos los campos son requeridos.' }))
    // }

    // if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    //     req.session.user = {
    //         first_name: 'admin',
    //         last_name: 'admin',
    //         email,
    //         age: 'admin',
    //         role: 'admin',
    //     };
    //     return res.redirect('/');
    // }


    // const user = await UserModel.findOne({ email });
    // if (!user) {
    //     return res.render('error', ({ title: 'Login | Ecommerce', messageError: 'Correo o contraseña inválidos.' }))

    // }
    // if (user.password !== password) {
    //     return res.render('error', ({ title: 'Login | Ecommerce', messageError: 'Correo o contraseña inválidos.' }))
    // }

    // const {
    //     first_name,
    //     last_name,
    //     age,
    //     role,
    // } = user;

    // req.session.user = {
    //     first_name,
    //     last_name,
    //     email,
    //     age,
    //     role,
    // };
    // // res.status(200).json({ message: 'Sesión iniciada correctamente.' })
    // res.redirect('/profile')

    res.redirect('/login');
});

router.post('/users/me', async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'No estás autenticado.' });
    }

    res.status(200).json(req.session.user);

});

router.get('/session/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', ({ title: 'Error | Ecommerce', messageError: error.message }))

        }
    })
    res.redirect('/login');


});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/sessions/github/callback', passport.authenticate('github',
    { failureRedirect: '/login' }, (req, res) => {

        console.log('req.user', req.user);
        res.redirect('/profile');
    }));

export default router;

