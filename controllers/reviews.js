const campGround = require('../models/campGround');
const Reviews = require('../models/reviews');

module.exports.createReview = async (req,res,next) => {
    let review = new Reviews(req.body.review);
    let campground = await campGround.findById(req.params.id);
    review.submittedBy = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New review added!!!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Reviews.findById(reviewId);
    if(!review.submittedBy.equals(req.user._id)){
        req.flash('error','You are not authorized to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Reviews.findByIdAndDelete(reviewId);
    let camp = await campGround.findById(id);
    await camp.updateOne({$pull:{reviews:reviewId}}); 
    req.flash('success','Review deleted successfully!!!');   
    res.redirect(`/campgrounds/${id}`);
};