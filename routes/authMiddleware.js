const checkAuthentication = function(req,res,next){
    console.log(req.isAuthenticated);
    if(!req.isAuthenticated()){
        req.flash('error','You need to be logged in first!!!');
        return res.redirect('/login');
    };
    next();
}

module.exports = checkAuthentication;