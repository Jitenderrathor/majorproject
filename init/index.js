const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


main().then(() => {
    console.log("Database Connection Successful!");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"65a0198137feed3e956ce0bb"})) 
    await Listing.insertMany(initData.data);
    console.log("Old data deleted and New Initialied");
}
initDB();