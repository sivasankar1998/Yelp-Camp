const express= require('express');
const asyncCatch = require('../errorhandling/asyncCatch');
const {checkAuthentication,newValidate,isAuthorizedUser} = require('../authMiddleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const router = express.Router({mergeParams:true});

router.route('/')
    .get(asyncCatch(campgrounds.index))
    .post(checkAuthentication,newValidate,upload.array('image'),asyncCatch(campgrounds.createCampground));

router.get('/new',checkAuthentication,campgrounds.renderNewForm);


router.get('/:id/edit',checkAuthentication,isAuthorizedUser,asyncCatch(campgrounds.renderEditForm));

router.route('/:id')
    .get(asyncCatch(campgrounds.showCampground))
    .put(checkAuthentication,isAuthorizedUser,newValidate,upload.array('image'),asyncCatch(campgrounds.editCampground))
    .delete(checkAuthentication,isAuthorizedUser,asyncCatch(campgrounds.deleteCampground));

module.exports = router;