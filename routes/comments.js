const express = require("express");
const router = express.Router();

router.get("/commEdit", function(req, res){
    res.render("commEdit", {title: "Your Main Source of Fun"});
});

module.exports = router;