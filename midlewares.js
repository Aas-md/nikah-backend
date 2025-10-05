const Listing = require('./models/listingModel.js')
const Review = require('./models/reviewModel.js')
const { listingSchema, reviewSchema } = require("./schema.js")
const jwt = require('jsonwebtoken');
const ExpressError = require("./utils/expressError.js")
const User = require('./models/userModel.js')

module.exports.validateListing = (req, res, next) => {
   
    let { error } = listingSchema.validate(req.body)

    if (error) {

        throw new ExpressError(400, error)
    } else {
        next()
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) throw new ExpressError(401, "Listing not found");

    // user pick karo: session ya token
    let user = res.locals.currUser || req.user;
    if (req.headers.authorization && !user) {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, "secretCode")
        user = await User.findById(payload.id);
    }
    if (!user) throw new ExpressError(401, "Not authenticated") 

    // owner check
    if (!listing?.owner?._id.equals(user?._id)) {
        throw new ExpressError(401, "You are not the owner")
    }

    next();
};

module.exports.isLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {

        return next()
    }

    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        try {
            const payload = jwt.verify(token, 'secretCode')


            const user = await User.findById(payload.id);
            if (!user) {

                throw new ExpressError(401, 'User not found!')
            }

            req.user = user

            return next()
        } catch (err) {
            throw new ExpressError(401, 'You are not logged in' + err)

        }
    }

    // 3. Nahi mila to unauthorised

    throw new ExpressError(401, 'User not found')

}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        return res.status(422).json({ error: 'Error in validate review : ' + error })
    } else {
        next()
    }
}

module.exports.isReviewAthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review) {
        let err = new Error("Review not found")
        err.statusCode = 404
        throw err
    }

    const currUser =
        res.locals?.currUser || req.user;

    // if (!review.author._id.equals(res.locals?.currUser?._id)) {

    //     res.status(401).json({ error: "you are not the owner of this review" })
    //     // return res.redirect(`/listings/${id}`)
    // }

    if (!currUser) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    // ownership check
    if (!review.author._id.equals(currUser._id)) {
        return res
            .status(403)
            .json({ message: "You are not the owner of this review" })
    }

    next()

}