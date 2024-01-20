const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utile/wrapAsync");
const ExpressError = require("../utile/ExpressError");
const { isLoggedIn, isAuthor, validateReview } = require("../utile/middliware");
const reviewController = require("../controller/review");






// Create Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// Delete Review Route
router.delete("/:revId",isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;