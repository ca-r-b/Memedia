const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Setup MongoDB Connection [===== INCOMPLETE PA I THINK???? =====]
mongoose.connect("mongodb://localhost:27017/memediadb", {useNewUrlParser: true});

const app = express();

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(){
    console.log("Server now running on port 3000");
});

// ROUTES
// NOTE: These routes are NOT YET PROPERLY IMPLEMENTED 
//          1. Must be in Routes folder
//          2. Must use the appropriate HTTP methods (get vs post)
app.get("/", function(req, res){
    res.render("index", {title: "Your Main Source of Fun"});
});

app.get("/login", function(req, res){
    res.render("login", {title: "Login"});
});

app.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

app.get("/postCreate", function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

app.get("/aboutUs", function(req, res){
    res.render("aboutUs", {title: "About Us"});
});

app.get("/settings", function(req, res){
    res.render("settings", {title: "Account Settings"});
});

app.get("/postView", function(req, res){
    res.render("postView", {title: "Your Main Source of Fun"});
});

app.get("/userView", function(req, res){
    res.render("userView", {title: "Your Main Source of Fun"});
});

app.get("/commEdit", function(req, res){
    res.render("commEdit", {title: "Your Main Source of Fun"});
});

// HOME

app.post("/home", function(req, res){
    res.render("home", {title: "Your Main Source of Fun"});
});

app.get("/home", function(req, res){
    res.render("home", {title: "Your Main Source of Fun"});
});