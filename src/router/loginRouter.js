const express = require('express');
const User = require('../dao/models/userModel');
const router = express.Router()
const passport = require('passport');



router.post('/login', passport.authenticate('local', {
    successRedirect: '/products', 
    failureRedirect: '/login', 
    failureFlash: true
}));

module.exports = router