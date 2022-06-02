const express= require('express');
const {newSchema} = require('../errorhandling/joiSchema');
const asyncCatch = require('../errorhandling/asyncCatch');
const expressError = require('../errorhandling/ExpressError');
const campGround = require('../models/campGround');
const checkAuthentication = require('./authMiddleware');
const router = express.Router({mergeParams:true});

const newValidate = (req,res,next)=>{
    const {error} = newSchema.validate(req.body);
    if(error){
        let msg = error.details.map(obj => obj.message).join(",");
        console.log(error.details);
        throw new expressError(msg,500);
    }
    else{
        next();
    }
};

router.get('/',asyncCatch(async (req,res,next)=>{
    let campgrounds = await campGround.find({});
    res.render('list', {campgrounds});
}));

router.get('/new',checkAuthentication,(req,res)=>{
    res.render('new');
});

router.get('/:id/edit',checkAuthentication,asyncCatch(async (req,res,next)=>{
    let campground = await campGround.findById(req.params.id);
    if(!campground){
        req.flash('error','No Campground found by that ID');
        return res.redirect('/campgrounds');
    }
    res.render('edit',{campground});
}));

router.get('/:id',asyncCatch(async (req,res,next)=>{
    let campground = await campGround.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','No Campground found by that ID');
        return res.redirect('/campgrounds');
    }
    res.render('show',{campground});
}));

router.post('/',checkAuthentication,newValidate,asyncCatch(async (req,res,next)=>{
    let camp = new campGround(req.body.campground);
    await camp.save();
    req.flash('success','New Campground created!!!');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.put('/:id',checkAuthentication,newValidate,asyncCatch(async (req,res,next)=>{
    let {id} = req.params;
    await campGround.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Campground edited successfully!!!');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id',checkAuthentication,asyncCatch(async (req,res,next)=>{
    let {id} = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success','Campground deleted successfully!!!');
    res.redirect('/campgrounds');
}));

module.exports = router;