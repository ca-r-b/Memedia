const express = require("express");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/login", function(req, res){
    res.render("login", {title: "Login"});
});

router.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

module.exports = router;