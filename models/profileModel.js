const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./reviewModel.js');
const { required } = require('joi');

const profileSchema = Schema({

    name: {
        type : String,
        required : true
    },
    gender: {
        type : String,
        enum : ["Male","Female","Other"],
        required : true
    },
    dateOfBirth: Date,
    religion: String,
    caste: String,
    motherTongue: String,
    location: String,
    education: String,
    profession: String,
    height: String,
    age : Number,
    maritalStatus: {
        type: String,
        enum: ["Never Married", "Divorced", "Widowed"],
        
    },

    reviews: [
        {
            "type": mongoose.Schema.Types.ObjectId,
            "ref": "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        url: String,
        filename: String,
    },



})


profileSchema.post("findOneAndDelete", async (profile) => {

    if (profile) {
        await Review.deleteMany({ _id: { $in: profile.reviews } })
    }

})

const Profile = new mongoose.model("Profile", profileSchema)
module.exports = Profile
