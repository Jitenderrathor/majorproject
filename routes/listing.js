const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utile/wrapAsync");
const ExpressError = require("../utile/ExpressError");
const {isLoggedIn, isOwner} = require("../utile/middliware");
const {listingSchema, reviewSchema} = require("../utile/schema");


// middleware for velidating req.body
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
})

// New Route
router.get("/new",isLoggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}))

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate("owner");
    console.log(list);
    if(!list){
        req.flash("error", "Listing you are trying to reach dose not exists");
    res.redirect("/listings");
    }
    // console.log(req.user._id);
    // console.log(list.owner._id);
    res.render("listings/show.ejs", { list });
}))

// Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {
    let validateRes = listingSchema.validate(req.body);
    console.log(validateRes)
    let newData = new Listing(req.body.listing);
    newData.owner = req.user._id;
    await newData.save();
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
}))

// Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    console.log(list);
    res.render("listings/edit.ejs", { list });
}))

// Update Route
router.put("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
}))

module.exports = router;