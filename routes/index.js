const express = require("express");
const User = require("../models/users");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/", function(req, res){
    res.render("index", {title: "Your Main Source of Fun"});
});

// router.get("/", function(req, res){
//     User.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// });

router.post("/home", function(req, res){
    res.render("home", {title: "Your Main Source of Fun"});
});

router.get("/home", function(req, res){
    res.render("home", {title: "Your Main Source of Fun"});
});

router.get("/aboutUs", function(req, res){
    res.render("aboutUs", {title: "About Us"});
});

module.exports = router;