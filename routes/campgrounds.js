const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const {checkAuthentication,newValidate,isAuthorizedUser} = require('../authMiddleware');
const campgrounds = require('../controllers/campgrounds');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(asyncCatch(campgrounds.index))
    .post(checkAuthentication,newValidate,asyncCatch(campgrounds.createCampground));

router.get('/new',checkAuthentication,campgrounds.renderNewForm);


router.get('/:id/edit',checkAuthentication,isAuthorizedUser,asyncCatch(campgrounds.renderEditForm));

router.route('/:id')
    .get(asyncCatch(campgrounds.showCampground))
    .put(checkAuthentication,isAuthorizedUser,newValidate,asyncCatch(campgrounds.createCampground))
    .delete(checkAuthentication,isAuthorizedUser,asyncCatch(campgrounds.deleteCampground));

module.exports = router;