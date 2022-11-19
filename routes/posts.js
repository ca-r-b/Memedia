const express = require("express");
const router = express.Router();
const path = require('path');
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
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

    // TO-DO: Adding to Database here***
});

// ============== Post Viewing ==============

router.get("/post/:id", function(req, res){
    const postID = req.params.id;
    console.log(postID)

    Post.findById(postID)
        .then((postRes) => {
            Comment.find({postID: postID})
                .then((commRes) => {
                    User.findOne({username: postRes.username})
                        .then((userRes) => {
                            res.render("postView", {
                                title: "Your Main Source of Fun",
                                user: userRes,
                                post: postRes,
                                comments: commRes
                        })
                        .catch((err) =>{
                            console.log(err);
                        })
                    
                })
                .catch((err) =>{
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
    
    });
});


// ============== Post Reporting ==============

router.post("/postReport/:id", function(req, res){
    const postID = req.params.id;
    console.log(postID)

    Post.findById(postID)
        .then((results) => {
            res.render("reportPost", {
                title: "Report Post",
                post: results
            });
        })
        .catch((err) =>{
            console.log(err);
        });
});

router.post("/confirmReport/:id", function(req, res){
    var repType = req.body.reportType;

    console.log(repType);

    const report = new RepPost({
        postID: req.params.id,
        // Replace "reporterUser with Logged-In User"
        reporterUser: "pop", 
        remarks: repType
    });

    report.save()
        .then((result) => {
            res.redirect("/post/" + req.params.id);
        })
        .catch((err) =>{
            res.send(err);
        });

});

module.exports = router;