const express = require("express");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/postCreate", function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

router.post("/postUpload", function(req, res){
    // Fill out
});

router.get("/postView", function(req, res){
    res.render("postView", {title: "Your Main Source of Fun"});
});

module.exports = router;