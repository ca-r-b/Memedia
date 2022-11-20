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

router.get("/user/:profileName", function(req, res){
    const profileName = req.params.profileName;
    console.log(profileName);

    User.findOne({username: profileName})
        .then((userRes) =>{
            Post.find({username: profileName})
                .then((postRes) =>{
                    res.render("userView", {
                        title: "Your Main Source of Fun",
                        users: userRes,
                        posts: postRes
                    });
                })
                .catch((err) =>{
                    console.log(err);
                });
        })
        .catch((err) =>{
            console.log(err);
        });
});

router.get("/settings/:profileName", isAuth, function(req, res){
    const profileName = req.params.profileName;

    if(profileName === req.session.username){
        User.findOne({username: profileName})
        .then((userRes) =>{
            res.render("settings", {
                title: "Account Settings",
                user: userRes
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    }else{
        res.redirect("/");
    }

});

module.exports = router;