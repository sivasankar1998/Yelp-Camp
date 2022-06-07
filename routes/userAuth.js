const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const passport = require('passport');
const users = require('../controllers/users');

const router = express.Router({mergeParams:true});

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo:true}),asyncCatch(users.loginUser));

router.route('/register')
    .get(users.renderRegisterForm)
    .post(asyncCatch(users.registerUser));

router.get('/logout',asyncCatch(users.logoutUser));

module.exports = router;