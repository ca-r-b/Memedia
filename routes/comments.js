const express = require("express");
const router = express.Router();

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/commEdit", function(req, res){
    res.render("commEdit", {title: "Your Main Source of Fun"});
});

module.exports = router;