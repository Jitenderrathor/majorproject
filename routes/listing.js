const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utile/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../utile/middliware");
const listController = require("../controller/listing");
const multer = require('multer');
const {storage} = require('../cloudConfig');
const upload = multer({ storage });



router.route("/")
    // Index Route
    .get(wrapAsync(listController.index))
    // Create Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listController.create))

// New Route
router.get("/new", isLoggedIn, wrapAsync(listController.new))

router.route("/:id")
    // Show Route
    .get(wrapAsync(listController.show))
    // Update Route
    .put(isLoggedIn, isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listController.update))
    // Delete Route
    .delete(isLoggedIn, wrapAsync(listController.delete))


// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listController.edit))



module.exports = router;