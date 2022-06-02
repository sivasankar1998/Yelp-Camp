const checkAuthentication = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error','You need to be logged in first!!!');
        return res.redirect('/login');
    };
    next();
}

module.exports = checkAuthentication;