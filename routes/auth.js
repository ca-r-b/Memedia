const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

// ============== Login ==============

router.get("/login", function(req, res){
    if(!req.session.isLoggedIn){
        res.render("login", {title: "Login", msg: ""});
    }else{
        res.redirect("/home");
    }
});

router.post("/login", async function(req, res){
    const {username, password} = req.body;

    const loggedUser = await User.findOne({username: username});

    if(!loggedUser){
        return res.render("login", {title: "Login", msg: "Invalid credentials! Please try again"});
    }

    if(!(password === loggedUser.password)){
        return res.render("login", {title: "Login", msg: "Invalid credentials! Please try again"});
    }

    // Assign session variables
    req.session.isAuth = true;
    req.session.isLoggedIn = true;
    req.session.username = loggedUser.username;
    req.session.img = loggedUser.img;
    res.redirect("/home");
})

router.get("/logout", function(req, res){
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect("/");
    })
})

module.exports = router;