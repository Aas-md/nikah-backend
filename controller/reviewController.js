const Profile = require('../models/profileModel.js')
const Review = require('../models/reviewModel.js')

module.exports.addReview = async (req, res) => {

        let id = req.params.id
        let profile = await Profile.findById(id)
        if (!profile) {
                throw new ExpressError(404,"Profile not found exception")
        }
        let review = Review(req.body.review)
        profile.reviews.push(review)
        review.author = req.user._id
        await review.save()
        await profile.save()
        await review.populate('author', 'username');
        res.send({ "success": "success", "msg": "Review Added Successfuly", review: review })

}

module.exports.deleteReview = async (req, res) => {

        let { id, reviewId } = req.params
        await Profile.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Review.findByIdAndDelete(reviewId)
        res.status(200).json({ success: "Review Deleted Successfuly" })
}

