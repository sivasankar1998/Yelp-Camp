const {newSchema} = require('./errorhandling/joiSchema');
const campGround = require('./models/campGround');
const {reviewSchema} = require('./errorhandling/joiSchema');
const expressError = require('./errorhandling/ExpressError');
const { redirect } = require('express/lib/response');

module.exports.checkAuthentication = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error','You need to be logged in first!!!');
        return res.redirect('/login');
    };
    next();
}

module.exports.newValidate = (req,res,next)=>{
    const {error} = newSchema.validate(req.body);
    if(error){
        let msg = error.details.map(obj => obj.message).join(",");
        req.flash('error',msg);
        res.redirect(req.returnTo);
    }
    else{
        next();
    }
};

module.exports.isAuthorizedUser = async (req,res,next)=>{
    let {id} = req.params;
    let campground = await campGround.findById(id);
    if(!campground.submittedBy.equals(req.user._id)){
        req.flash('error',"Not authorized to do that");
        redirect = req.returnTo || `/campgrounds/${id}`;
        return res.redirect(redirect);
    };
    next();
};

module.exports.reviewValidate = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let msg = error.details.map(obj => obj.message).join(",");
        console.log(error.details);
        req.flash('error',msg);
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    else{
        next();
    }
};