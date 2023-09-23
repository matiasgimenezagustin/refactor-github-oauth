const express = require('express')
const User = require('../dao/models/userModel'); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router()

router.get('/', (req, res)=>{

})


const bcrypt = require('bcrypt');
const saltRounds = 10; 


passport.use(new LocalStrategy(
    {
        usernameField: 'user[username]',
        passwordField: 'user[password]'
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
router.post('/', async (req, res) => {
    try {
        const { user } = req.body;

        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        const newUser = new User({
            username: user.username,
            email: user.email,
            password: hashedPassword,
        });

        await newUser.save();

        res.redirect('/'); 
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send({ ok: false, message: 'Error al registrar el usuario' });
    }
});



module.exports = router