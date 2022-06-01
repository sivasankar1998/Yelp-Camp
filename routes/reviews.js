const express= require('express');
const {reviewSchema} = require('../errorhandling/joiSchema');
const asyncCatch = require('../errorhandling/asyncCatch');
const expressError = require('../errorhandling/ExpressError');
const campGround = require('../modules/campGround');
const Reviews = require('../modules/reviews');

const router = express.Router({mergeParams:true});

function reviewValidate(req,res,next){
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let msg = error.details.map(obj => obj.message).join(",");
        console.log(error.details);
        throw new expressError(msg,500);
    }
    else{
        next();
    }
};

router.post('/',reviewValidate,asyncCatch(async (req,res,next) => {
    let review = new Reviews(req.body.review);
    let campground = await campGround.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New review added!!!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId',asyncCatch(async (req,res,next)=>{
    let {id,reviewId} = req.params;
    await Reviews.findByIdAndDelete(reviewId);
    let camp = await campGround.findById(id);
    await camp.updateOne({$pull:{reviews:reviewId}}); 
    req.flash('success','Review deleted successfully!!!');   
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;