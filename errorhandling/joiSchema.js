const joi = require('joi');

module.exports.newSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        image: joi.array().items(joi.object({
            path:joi.string(),
            filename:joi.string(),
            size:joi.number(),
            originalname:joi.string()
        })).required(),
        price: joi.number().min(0).required(),
        description: joi.string().required()
    })
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    })
});