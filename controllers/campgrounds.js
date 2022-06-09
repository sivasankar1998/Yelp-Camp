const campGround = require('../models/campGround');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req,res,next)=>{
    let campgrounds = await campGround.find({});
    res.render('list', {campgrounds});
};

module.exports.renderNewForm = (req,res)=>{
    res.render('new');
};

module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    let campground = await campGround.findById(id);
    if(!campground){
        req.flash('error','No Campground found by that ID');
        return res.redirect('/campgrounds');
    };
    res.render('edit',{campground});
};

module.exports.showCampground = async (req,res,next)=>{
    let campground = await campGround.findById(req.params.id).populate({path:'reviews',populate:{path:'submittedBy'}}).populate('submittedBy');
    if(!campground){
        req.flash('error','No Campground found by that ID');
        return res.redirect('/campgrounds');
    };
    res.render('show',{campground});
};

module.exports.createCampground = async (req,res,next)=>{
    let camp = new campGround(req.body.campground);
    let image = req.files.map(file => ({path:file.path,originalname:file.originalname,size:file.size,filename:file.filename}));
    camp.image = image;
    camp.submittedBy = req.user._id;
    await camp.save();
    req.flash('success','New Campground created!!!');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.editCampground = async (req,res,next)=>{
    let {id} = req.params;
    console.log(req.files);
    let camp = await campGround.findByIdAndUpdate(id,{...req.body.campground});
    if(req.files){
    let images = req.files.map(file => ({path:file.path,originalname:file.originalname,size:file.size,filename:file.filename}));
    camp.image.push(...images);
    };
    if(req.body.deleteImages){
        //if(!req.files){
            if(req.body.deleteImages.length<camp.image.length){
                console.log(req.body);
                for (let filename of req.body.deleteImages) {
                    await cloudinary.uploader.destroy(filename);  
                }
                req.flash('success','Images deleted successfully')
                await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}});
            }else{
                req.flash('error','Need atleast one image');
            };
/*         }else{
            if(Math.abs(req.files.length-req.body.deleteImages.length)<=camp.image.length){
                for (let filename of req.body.deleteImages) {
                    await cloudinary.uploader.destroy(filename);  
                }
                req.flash('success','Images deleted successfully')
                await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}});
            }else{
                req.flash('error','Need atleast one image');
            }
        } */
    };
    await camp.save();
    req.flash('success','Campground edited successfully!!!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req,res,next)=>{
    let {id} = req.params;
    let camp = await campGround.findByIdAndDelete(id);
    for(img of camp.image){
        if(img.filename){
            await cloudinary.uploader.destroy(img.filename);
        }
    };
    req.flash('success','Campground deleted successfully!!!');
    res.redirect('/campgrounds');
};