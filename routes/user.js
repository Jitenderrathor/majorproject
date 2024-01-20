const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utile/wrapAsync");
const ExpressError = require("../utile/ExpressError");

const passport = require("passport");
const {saveRedirectUrl} = require("../utile/middliware");
const userController = require("../controller/user");

// Middleware to Authenticate User
const userAuth = passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true })





router.route("/signup")
// SignUp User
.get( userController.signUpForm)

// Register User
.post(wrapAsync(userController.regUser))


router.route("/login")
// Login User
.get(userController.loginUser)
// Authenticate User
.post(saveRedirectUrl, userAuth, userController.userAuth)

// Logout User
router.get("/logout", userController.logOutUser)

module.exports = router;