const express = require("express");
const router = express.Router();
const path = require('path');
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");

// TO-DO - DATABASE NEEDED: Add .post of routes


// ============== Post Uploading ==============

router.get("/postCreate", function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

router.post("/postUpload", function(req, res){
    var img = req.files.postImg;
    var imgName = img.name;

    // Redirect to upload folder
    img.mv(path.resolve(__dirname + '/..', 'public/images/posts', imgName));

    // Adding to Database here***
});

// ============== Post Reporting ==============

router.post("/postReport/:id", function(req, res){
    var repType = req.body.reportType;

    const report = new RepPost({
        postID: req.params.id,
        // Replace "reporterUser with Logged-In User"
        reporterUser: "pop", 
        remarks: repType
    });

    report.save()
        .then((result) => {
            res.redirect(req.get("referer"));
        })
        .catch((err) =>{
            res.send(err);
        });

});

// ============== Post Viewing ==============

router.get("/postView", function(req, res){
    res.render("postView", {title: "Your Main Source of Fun"});
});

module.exports = router;