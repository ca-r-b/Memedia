const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// ============== Comment Adding ==============


// ============== Comment Reporting ==============

router.post("/commReport/:idpost/:idcomm", isAuth,function(req, res){
    const postID = req.params.idpost;
    const commentID = req.params.idcomm;
    console.log(postID)

    Post.findById(postID)
        .then((postRes) =>{
            Comment.findById(commentID)
                .then((commRes) => {
                    res.render("reportComment", {
                        title: "Report Comment",
                        post: postRes,
                        comment: commRes
                    });
                })
                .catch((err) =>{
                    console.log(err);
                });
        })
        .catch((err) =>{
            console.log(err);
        })
    
});

router.post("/confirmCommReport/:idpost/:idcomm", isAuth, function(req, res){ 
    var commentID = req.params.idcomm;
    var postID = req.params.idpost;
    var repType = req.body.reportType;

    console.log(repType);

    const report = new RepComment({
        // TO-DO: Replace "reporterUser with Logged-In User"
        reporterUser: "pop", 
        remarks: repType,
        commentID: commentID
    });

    report.save()
        .then((result) => {
            res.redirect("/post/" + postID);
        })
        .catch((err) =>{
            res.send(err);
        });

});

// ============== Comment Editing ==============

router.get("/commEdit", isAuth, function(req, res){
    res.render("commEdit", {title: "Your Main Source of Fun"});
});

module.exports = router;