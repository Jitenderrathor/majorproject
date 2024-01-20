const Listing = require("../models/listing");
const Review = require("../models/review");
const {listingSchema, reviewSchema} = require("../utile/schema");
const ExpressError = require("./ExpressError");



module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.path,"...",req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be login to create listings!");
        return res.redirect("/user/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this list!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    let { id, revId } = req.params;
    let review = await Review.findById(revId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// middleware for velidating req.body
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// middleware for velidating req.body
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}