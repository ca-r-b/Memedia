const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/login", function(req, res){
    res.render("login", {title: "Login"})
});

// router.post("/login/verify", function(req, res){
//     var user = req.body.username;
//     var pass = req.body.password;

//     User.findOne({username: user, password: pass}).then((results) => {
//         Post.find().sort({dateCreated: -1})
//             .then((result) =>{
//                 res.render("home", {
//                     title: "Your Main Source of Fun",
//                     posts: result,
//                     loggedIn: 1,
//                     loggedUser: user
//                 });
//             })
//             .catch((err) =>{
//                 console.log(err);
//             });
//     }).catch((err) => {
//         console.log(err);
//     });
// })

router.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

module.exports = router;