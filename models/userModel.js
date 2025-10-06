const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
        type: Date,
       
    },
    age: {
        type: Number
    },
    religion: {
        type: String,
        
    },
    sect: {
        type: String // e.g., Sunni, Shia
    },
    maritalStatus: {
        type: String,
        enum: ["Never Married", "Divorced", "Widowed"],
        
    },
    education: {
        type: String
    },
    occupation: {
        type: String
    },
    height: {
        type: String // e.g., "5ft 8in"
    },
    location: {
        type: String
    },
    about: {
        type: String
    },
    photo: {
        type: String // Cloudinary URL or local path
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);