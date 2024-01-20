const Listing = require("../models/listing");
const Review = require("../models/review");
const {reviewSchema} = require("../utile/schema");
const ExpressError = require("../utile/ExpressError");




module.exports.createReview = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    console.log(req.user);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    let {id, revId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews :revId}});
    await Review.findByIdAndDelete(revId);
    res.redirect(`/listings/${id}`);
}