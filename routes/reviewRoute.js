const express = require("express")
const router = express.Router({mergeParams : true})
const controller = require('../controller/reviewController.js')
const {isLoggedIn, validateReview,isReviewAthor} = require('../midlewares.js') 
const wrapAsync = require('../utils/wrapAsync.js')


router.post('/',isLoggedIn,validateReview,wrapAsync(controller.addReview))

router.delete('/:reviewId',isLoggedIn,isReviewAthor,wrapAsync(controller.deleteReview))

module.exports = router