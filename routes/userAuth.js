const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const expressError = require('../errorhandling/ExpressError');
const User = require('../models/users');
const passport = require('passport');
const router = express.Router({mergeParams:true});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/register',asyncCatch(async (req,res)=>{
    try {
        let {username,password,email} = req.body;
        let user = new User({username,email});
        let registeredUser = await User.register(user,password);
        req.flash('success','New user registered');
        return res.redirect('/campgrounds');
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}));

router.post('/login',passport.authenticate('local', { failureFlash: true,failureRedirect: '/login' }),asyncCatch(async (req,res)=>{
    req.flash('success','Logged in');
    return res.redirect('/campgrounds');
}));

module.exports = router;