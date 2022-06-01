const express= require('express');
const {newSchema} = require('../errorhandling/joiSchema');
const asyncCatch = require('../errorhandling/asyncCatch');
const expressError = require('../errorhandling/ExpressError');
const campGround = require('../modules/campGround');

const router = express.Router();

function newValidate(req,res,next){
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

router.get('/new',(req,res)=>{
    res.render('new');
});

router.get('/:id/edit',asyncCatch(async (req,res,next)=>{
    let campground = await campGround.findById(req.params.id);
    res.render('edit',{campground});
}));

router.get('/:id',asyncCatch(async (req,res,next)=>{
    let campground = await campGround.findById(req.params.id).populate('reviews');
    res.render('show',{campground});
}));

router.post('/',newValidate,asyncCatch(async (req,res,next)=>{
    newValidate(req.body);
    let camp = new campGround(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.put('/:id',newValidate,asyncCatch(async (req,res,next)=>{
    let {id} = req.params;
    await campGround.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id',asyncCatch(async (req,res,next)=>{
    let {id} = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;