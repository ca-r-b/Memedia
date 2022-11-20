const express = require("express");
const Post = require("../models/posts");
const User = require("../models/users");
const router = express.Router();

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/", function(req, res){
    if(req.session.isAuth){
        res.redirect("/home");
    }else{
        Post.find().sort({dateCreated: -1})
        .then((result) =>{
            res.render("index", {
                title: "Your Main Source of Fun",
                posts: result
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    }
});

// To be removed after "Login" is working
router.get("/home", isAuth, function(req, res){
    Post.find().sort({dateCreated: -1})
        .then((result) =>{
            res.render("home", {
                title: "Your Main Source of Fun",
                posts: result
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    
});

router.get("/aboutUs", function(req, res){
    res.render("aboutUs", {title: "About Us"});
});

module.exports = router;