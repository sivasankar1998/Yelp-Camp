const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const expressError = require('../errorhandling/ExpressError');
const User = require('../models/users');
const passport = require('passport');
const router = express.Router();

router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/register',asyncCatch(async (req,res)=>{
    try {
        let {username,password,email} = req.body.auth;
        let user = new User({username,email});
        let registeredUser = await User.register(user,password);
        req.flash('success','New user registered');
        return res.redirect('/campgrounds');
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}));

router.post('/login',asyncCatch(async (req,res)=>{
    let {username,password} = req.body.auth;
    const authenticate = User.authenticate();
    let {user} = await authenticate(username,password);
    if(user){
        req.flash('success','Logged in');
        console.log(user);
        return res.redirect('/campgrounds');
    }
    req.flash('error','Try again')
    res.redirect('/login')
}));

module.exports = router;