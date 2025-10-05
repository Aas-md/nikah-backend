const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('../models/reviewModel.js')

const listingSchema = Schema({
    title: {
        type: String,
        require: true
    },
    desc: String,

    price: Number,
    address: String,
    city: String,

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


listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }

})

const Listing = new mongoose.model("Listing", listingSchema)
module.exports = Listing
