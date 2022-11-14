const express = require("express");
const router = express.Router();

router.get("/userView", function(req, res){
    res.render("userView", {title: "Your Main Source of Fun"});
});

router.get("/settings", function(req, res){
    res.render("settings", {title: "Account Settings"});
});

module.exports = router;