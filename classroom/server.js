const express = require("express");
const app = express();
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const session = require("express-session");

const sessionOption = { secret: "mysecreatstring", resave:false,saveUninitialized:true } 
app.use(session(sessionOption));
app.use(flash());
app.use(async (req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})


app.get("/test", (req, res) => {
    res.send("test successfull!");
})

app.get("/reqcount", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You sent a request ${req.session.count} times`);
})

app.get("/register", (req, res) => {
   let {name="anonymous"} = req.query;
   if(name=== "anonymous"){
   req.flash("error", "user not registered successfull!");
   } else{
   req.flash("success", "user registered successfull!");
   }
   req.session.name = name;
   res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name : req.session.name});
})



app.listen(3000, () => {
    console.log("server is now listening at port 3000");
})