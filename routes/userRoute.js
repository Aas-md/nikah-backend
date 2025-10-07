const controller = require('../controller/userController.js')
const express = require("express")
const router = express.Router()
const passport = require('passport')
const wrapAsync = require("../utils/wrapAsync")
const { isLoggedIn, validateUser, isUserAuthorized } = require('../midlewares.js')


router.route('/signup')
    .post(wrapAsync(controller.signup))


router.route('/login')
    .post(passport.authenticate('local', { failureMessage: true }),
        controller.login
    )

router.route('/complete/:id')
    .put(isLoggedIn,isUserAuthorized,validateUser,wrapAsync(controller.completeProfile))


router.get('/logout', controller.logout)

module.exports = router