const express = require("express");
const Post = require("../models/posts");
const User = require("../models/users");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/", function(req, res){
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
});

router.post("/home", function(req, res){
    res.render("home", {title: "Your Main Source of Fun"});
    
});

// // To be removed after "Login" is working
// router.post("/home", function(req, res){
//     Post.find().sort({dateCreated: -1})
//         .then((result) =>{
//             res.render("home", {
//                 title: "Your Main Source of Fun",
//                 posts: result
//             });
//         })
//         .catch((err) =>{
//             console.log(err);
//         });
// });

router.get("/aboutUs", function(req, res){
    res.render("aboutUs", {title: "About Us"});
});

module.exports = router;