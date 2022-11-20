const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/login", function(req, res){
    res.render("login", {title: "Login"});
});

router.post("/login", async function(req, res){
    const {username, password} = req.body;

    const loggedUser = await User.findOne({username: username});

    if(!loggedUser){
        return res.redirect("/login");
    }

    if(!(password === loggedUser.password)){
        console.log("logged: " + loggedUser.password)
        return res.redirect("/login"); 
    }

    // Assign session variables
    req.session.isAuth = true;
    req.session.isLoggedIn = true;
    req.session.username = loggedUser.username;
    req.session.email = loggedUser.email;
    req.session.bio = loggedUser.bio;
    req.session.img = loggedUser.img;
    res.redirect("/home");
})

router.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

router.get("/logout", function(req, res){
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect("/");
    })
})

module.exports = router;