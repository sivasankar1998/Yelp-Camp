const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema({
    rating:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Review',reviewSchema);