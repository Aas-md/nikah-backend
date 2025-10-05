require('dotenv').config()
const express = require("express")
const router = express.Router()
let controller = require('../controller/listingController.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage})
const middleware = require('../midlewares.js')
const { isLoggedIn, validateListing } = middleware
const wrapAsync = require("../utils/wrapAsync.js")


router.route('/')
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(controller.addNewListing))
.get(wrapAsync(controller.index))

router.route('/:id')
 .put(isLoggedIn,middleware.isOwner,upload.single('listing[image]'),validateListing,wrapAsync(controller.updateListing))
 .get(wrapAsync(controller.showListing))
 .delete(isLoggedIn,middleware.isOwner,wrapAsync(controller.deleteListing))

module.exports = router
