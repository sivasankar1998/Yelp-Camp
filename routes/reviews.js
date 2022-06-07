const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const reviews = require('../controllers/reviews');
const {checkAuthentication,reviewValidate} = require('../authMiddleware');

const router = express.Router({mergeParams:true});

router.post('/',checkAuthentication,reviewValidate,asyncCatch(reviews.createReview));

router.delete('/:reviewId',checkAuthentication,asyncCatch(reviews.deleteReview));

module.exports = router;