const Joi = require('joi');

module.exports.profileSchema = Joi.object({
        profile: Joi.object({
                name: Joi.string().required(),
                gender: Joi.string().valid("Male", "Female", "Other").required(),
                dateOfBirth: Joi.date().optional(),
                age: Joi.number().min(0).optional(),
                religion: Joi.string().optional(),
                caste: Joi.string().optional(),
                motherTongue: Joi.string().optional(),
                location: Joi.string().optional(),
                education: Joi.string().optional(),
                profession: Joi.string().optional(),
                height: Joi.string().optional(),
                maritalStatus : Joi.string().valid("Never Married", "Divorced", "Widowed"),
                image: Joi.string().allow("", null)
        }).required()

})

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
                rating: Joi.number().required().min(1).max(5),
                comment: Joi.string().required()
        }).required()

})

module.exports.userSchema = Joi.object({
        username: Joi.string(),
        password: Joi.string(),
        name: Joi.string().min(2),
        gender: Joi.string().valid("Male", "Female", "Other"),
        dateOfBirth: Joi.date(),
        age: Joi.number().min(0),
        religion: Joi.string(),
        sect: Joi.string(),
        maritalStatus: Joi.string().valid("Never Married", "Divorced", "Widowed"),
        education: Joi.string(),
        occupation: Joi.string(),
        height: Joi.string(),
        location: Joi.string(),
        about: Joi.string(),

})