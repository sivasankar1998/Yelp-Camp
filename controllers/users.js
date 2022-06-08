const User = require('../models/users');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('register');
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('login');
};

module.exports.registerUser = async (req,res)=>{
    try {
        let {username,password,email} = req.body;
        let user = new User({username,email});
        await User.register(user,password);
        req.flash('success','New user registered');
        req.login(user, function (err) {
            if (!err){
                let redirect = req.session.returnTo || "/campgrounds";
                delete req.session.returnTo
                return res.redirect(redirect);
            };
        });
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
};

module.exports.logoutUser = async (req,res,next)=>{
    req.flash('success','Logged out');
    let redirect = "/campgrounds";
    req.logout((err)=>{
        if (err) return next(err); });
    res.redirect(redirect);
};

module.exports.loginUser = async (req,res)=>{
    req.flash('success','Logged in');
    let redirect = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo
    res.redirect(redirect);
};