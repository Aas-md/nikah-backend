const Profile = require('./models/profileModel.js')
const Review = require('./models/reviewModel.js')
const { profileSchema: profileSchema, reviewSchema, userSchema } = require("./schema.js")
const jwt = require('jsonwebtoken');
const ExpressError = require("./utils/expressError.js")
const User = require('./models/userModel.js')

module.exports.validateProfile = (req, res, next) => {

    let { error } = profileSchema.validate(req.body)

    if (error) {

        throw new ExpressError(400, error)
    } else {
        next()
    }
}

module.exports.validateUser = (req, res, next) => {

    let { error } = userSchema.validate(req.body)

    if (error) throw new ExpressError(400, error)
    else next()
}

module.exports.isUserAuthorized = async (req, res, next) => {

      let currUser = res.locals.currUser || req.user

      let {id} = req.params;
    //   let user = await User.findById(id)
      
        if(id != currUser._id){
            throw new ExpressError(404, "You are not authorized to update the user")
        }
      return next()

}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const profile = await Profile.findById(id).populate("owner");
    if (!profile) throw new ExpressError(401, "Profile not found");

    // user pick karo: session ya token
    let user = res.locals.currUser || req.user;
    if (req.headers.authorization && !user) {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, "secretCode")
        user = await User.findById(payload.id);
    }
    if (!user) throw new ExpressError(401, "Not authenticated")

    // owner check
    if (!profile?.owner?._id.equals(user?._id)) {
        throw new ExpressError(401, "You are not the owner")
    }

    next();
};

// module.exports.isLoggedIn = async (req, res, next) => {
//     if (req.isAuthenticated()) {

//         return next()
//     }

//     const authHeader = req.headers.authorization
//     if (authHeader) {
//         const token = authHeader.split(' ')[1]
//         try {
//             const payload = jwt.verify(token, 'secretCode')


//             const user = await User.findById(payload.id);
//             if (!user) {

//                 throw new ExpressError(401, 'User not found!')
//             }

//             req.user = user

//             return next()
//         } catch (err) {
//             throw new ExpressError(401, 'You are not logged in' + err)

//         }
//     }

//     // 3. Nahi mila to unauthorised

//     throw new ExpressError(401, 'User not found')

// }

module.exports.isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (authHeader) {
            // ✅ JWT token case (frontend / Postman)
            const token = authHeader.split(' ')[1];
            const payload = jwt.verify(token, 'secretCode');
            const user = await User.findById(payload.id);
            if (!user) throw new ExpressError(401, 'User not found');
            req.user = user;
            return next();
        }

        // ✅ Session case (req.isAuthenticated for cookie-based)
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next();
        }

        throw new ExpressError(401, 'You are not logged in');
    } catch (err) {
        next(new ExpressError(401, err));
    }
};


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