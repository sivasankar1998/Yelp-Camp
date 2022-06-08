const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./reviews');

const campGroundSchema = new Schema({
    title:String,
    image:[
        {   path:String,
            filename:String,
            size:Number,
            originalname:String
        }
    ],
    price:Number,
    description:String,
    location:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    submittedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

campGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('campGround',campGroundSchema);