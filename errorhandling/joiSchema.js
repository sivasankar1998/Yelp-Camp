const joi = require('joi');
module.exports.joiSchema = joi.object({
    campground: joi.object({
        title: joi.string().alphanum().required(),
        location: joi.string().required(),
        image: joi.string().required(),
        price: joi.number().min(0).required(),
        description: joi.string().required()
    })
});