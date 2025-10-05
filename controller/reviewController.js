const Listing = require('../models/listingModel.js')
const Review = require('../models/reviewModel.js')

module.exports.addReview = async (req, res) => {

        let id = req.params.id
        let listing = await Listing.findById(id)
        if (!listing) {
                throw new ExpressError(404,"Listing not found exception")
        }
        let review = Review(req.body.review)
        listing.reviews.push(review)
        review.author = req.user._id
        await review.save()
        await listing.save()
        await review.populate('author', 'username');
        res.send({ "success": "success", "msg": "Review Added Successfuly", review: review })

}

module.exports.deleteReview = async (req, res) => {

        let { id, reviewId } = req.params
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Review.findByIdAndDelete(reviewId)
        res.status(200).json({ success: "Review Deleted Successfuly" })
}

