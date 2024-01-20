const User = require("../models/user");

module.exports.signUpForm = (req, res) => {
    res.render("user/signup.ejs");
}
module.exports.regUser = async (req, res) => {
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
}

module.exports.loginUser =  (req, res) => {
    res.render("user/login.ejs");
}

module.exports.userAuth = (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome Back to Wanderlust! ${username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOutUser = (req, res, next) => {
    req.logOut((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success", `User Logout Successfully!`);
     res.redirect("/listings");
    })
    
 }