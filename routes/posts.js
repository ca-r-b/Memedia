const express = require("express");
const router = express.Router();
const path = require('path');

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/postCreate", function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

router.post("/postUpload", function(req, res){
    var img = req.files.postImg;
    var imgName = img.name;

    // Redirect to upload folder
    img.mv(path.resolve(__dirname + '/..', 'public/images/posts', imgName));
});

router.get("/postView", function(req, res){
    res.render("postView", {title: "Your Main Source of Fun"});
});

module.exports = router;