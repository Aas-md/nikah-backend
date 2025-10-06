require('dotenv').config()
const express = require("express")
const router = express.Router()
let controller = require('../controller/profileController.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage})
const middleware = require('../midlewares.js')
const { isLoggedIn,  validateProfile } = middleware
const wrapAsync = require("../utils/wrapAsync.js")


router.route('/')
.post(isLoggedIn,upload.single('profile[image]'),validateProfile, wrapAsync(controller.addNewProfile))
.get(wrapAsync(controller.index))

router.route('/:id')
 .put(isLoggedIn,middleware.isOwner,upload.single('profile[image]'),validateProfile,wrapAsync(controller.updateProfile))
 .get(wrapAsync(controller.showProfile))
 .delete(isLoggedIn,middleware.isOwner,wrapAsync(controller.deleteProfile))

module.exports = router
