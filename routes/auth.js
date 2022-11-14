const express = require("express");
const router = express.Router();

router.get("/login", function(req, res){
    res.render("login", {title: "Login"});
});

// TO-DO - DATABASE NEEDED: Add .post

router.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

// TO-DO - DATABASE NEEDED: Add .post

module.exports = router;