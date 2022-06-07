const { types } = require('joi');
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
    },
    submittedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review',reviewSchema);