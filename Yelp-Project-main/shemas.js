const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    title: joi.string().required(),
    // image: joi.string().required(),
    location: joi.string().required(),
    price: joi.string().required().min(0),
    description: joi.string().required(),
    deleteImage: joi.array()
});



module.exports.reviewSchema = joi.object({
    body: joi.string().required(),
    rating: joi.number().required().min(1).max(5)
})

module.exports.userSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().required()
})