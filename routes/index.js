const express = require("express");
const router = express.Router();

router.get("/", function(req, res){
    res.render("index", {title: "Your Main Source of Fun"});
});

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