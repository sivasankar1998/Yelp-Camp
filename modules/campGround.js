const mongoose = require('mongoose');
const {Schema} = mongoose;

const campGroundSchema=new Schema({
    title:String,
    price:String,
    description:String,
    location:String
});

module.exports = mongoose.model('campGround',campGroundSchema);