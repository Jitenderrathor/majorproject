const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utile/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../utile/middliware");







// SignUp User
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

// Register User
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome to Wanderlust! ${username} you are successfully login`);
        res.redirect("/listings");
        })
        
    } catch (error) {
        req.flash("error", `${error.message}`);
        res.redirect("/user/signup");
    }
}))

// Login User
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
})

// Middleware to Authenticate User
const userAuth = passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true })

// Authenticate User
router.post("/login", saveRedirectUrl, userAuth, (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome Back to Wanderlust! ${username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

// Logout User
router.get("/logout", (req, res, next) => {
   req.logOut((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success", `User Logout Successfully!`);
    res.redirect("/listings");
   })
   
})

module.exports = router;