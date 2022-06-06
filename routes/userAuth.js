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

router.get('/logout',asyncCatch(async (req,res,next)=>{
    req.flash('success','Logged out');
    let redirect = "/campgrounds";
    req.logout((err)=>{
        if (err) return next(err); });
    res.redirect(redirect);
}));

router.post('/login',passport.authenticate('local', { failureFlash: true,failureRedirect: '/login',keepSessionInfo: true }),asyncCatch(async (req,res)=>{
    req.flash('success','Logged in');
    let redirect = req.session.returnTo || "/campgrounds";
    res.redirect(redirect);
}));

module.exports = router;