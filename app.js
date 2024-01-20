require('dotenv').config();
console.log(process.env.CLOUD_API_KEY)
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utile/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

//Passport pack
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

let dburl = process.env.ATLASDB_URL
main().then(() => {
    console.log("Database Connection Successful!");
}).catch((err) => {
    console.log(err);
})
async function main() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    await mongoose.connect(dburl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to get value from post
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// store 
const store = MongoStore.create({
    mongoUrl:dburl,

    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
// store error
store.on("error", ()=>{
    console.log(`Error in mongosh session`, err);
})
// session 
const sessionOption = { 
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOption));

app.use(flash());

// Passport use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/registerUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"Student@gmail.com",
//         username:"DeltStudent1"
//     })

//     let addedUser = await User.register(fakeUser, "helloworld");
//     res.send(addedUser);
// })
// To use imported routes of listing
app.use("/listings", listingRouter);

// To use imported routes of reviews
app.use("/listings/:id/reviews", reviewRouter);

// To use imported routes of user
app.use("/user", userRouter);

/* 
// Root Route
app.get("/", (req, res) => {
    res.send("Working Perfect!");
})
 */

/*
app.get("/listingSchema", (req, res) => {
    let newListing = new Listing({
        title:"villa",
        description:"it is an really cool villa",
        image:"",
        price:4000,
        location:"punjab",
        country:"India"
    })
    newListing.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
    res.send("Listing Added");
}) */

// New Way 404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { message });
})
app.listen(8080, () => {
    console.log("App is now listening on port 8080");
})