const express = require("express");
const Post = require("../models/posts");
const User = require("../models/users");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/user/:profileName", function(req, res){
    const profileName = req.params.profileName;
    console.log(profileName);

    User.findOne({username: profileName})
        .then((userRes) =>{
            Post.find({username: profileName}).then((postRes) =>{
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

// to be deleted
router.get("/userlol", function(req, res){
    res.render("userView", {title: "Your"});
})

router.get("/settings", function(req, res){
    res.render("settings", {title: "Account Settings"});
});

module.exports = router;