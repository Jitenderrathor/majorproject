const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utile/wrapAsync");
const ExpressError = require("../utile/ExpressError");
const {reviewSchema} = require("../utile/schema");
const { isLoggedIn, isAuthor } = require("../utile/middliware");



// middleware for velidating req.body
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


// Create Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    console.log(req.user);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

// Delete Review Route
router.delete("/:revId",isAuthor, wrapAsync(async (req, res, next) => {
    let {id, revId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews :revId}});
    await Review.findByIdAndDelete(revId);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;