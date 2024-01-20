const Listing = require("../models/listing");
const { listingSchema } = require("../utile/schema");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate("owner");
    console.log(list);
    if (!list) {
        req.flash("error", "Listing you are trying to reach dose not exists");
        res.redirect("/listings");
    }
    // console.log(req.user._id);
    // console.log(list.owner._id);
    res.render("listings/show.ejs", { list });
}

module.exports.create = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    // let validateRes = listingSchema.validate(req.body);
    // console.log(validateRes)
    let newData = new Listing(req.body.listing);
    newData.owner = req.user._id;
    newData.image = { filename, url };
    await newData.save();
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    console.log(list);
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200,h_200,e_blur:100")
    res.render("listings/edit.ejs", { list, originalImageUrl });
}
module.exports.update = async (req, res) => {

    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let url = req.file.path
        let filename = req.file.filename
        updatedListing.image = { filename, url };
        await updatedListing.save()
    }

    res.redirect(`/listings/${id}`);
}
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
}