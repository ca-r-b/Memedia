const express = require("express");
const router = express.Router();

router.get("/postCreate", function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

router.get("/postView", function(req, res){
    res.render("postView", {title: "Your Main Source of Fun"});
});

module.exports = router;