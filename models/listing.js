const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.pexels.com/photos/12966791/pexels-photo-12966791.jpeg",
        set: (v)=> v === ""?"https://images.pexels.com/photos/12966791/pexels-photo-12966791.jpeg": v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}})
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing; 