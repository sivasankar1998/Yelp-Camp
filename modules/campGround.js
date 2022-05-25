const mongoose = require('mongoose');
const {Schema} = mongoose;

const campGroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String
});

module.exports = mongoose.model('campGround',campGroundSchema);