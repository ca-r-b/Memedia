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

router.post("/addComment/:idpost", isAuth, async function(req, res){
    const postID = req.params.idpost;
    const commentContent = req.body.commentInput;

    const comment = new Comment({
        postID: postID,
        username: req.session.username,
        date: new Date(),
        content: commentContent
    })

    const postHolder = await Post.findById(postID);

    await comment.save()
         .then((result) => {
            console.log("Comment Saved.");
        })
        .catch((err) =>{
            res.send(err);
        });
    
    const commCount = await Comment.count({postID: postID});

    await Post.updateOne(
        {username: postHolder.username, caption: postHolder.caption}, 
        {$set: {
            commentCount: commCount
        }}
    )

    res.redirect("/post/" + postID);
})

// ============== Comment Deleting ==============

router.post("/deleteComment/:idpost/:idcomm", isAuth, async function(req, res){
    const postID = req.params.idpost;
    const commID = req.params.idcomm;

    const postHolder = await Post.findById(postID);

    await Comment.deleteOne({_id: commID});

    // Update Post - Comment Count
    const commCount = await Comment.count({postID: postID});

    await Post.updateOne(
        {username: postHolder.username, caption: postHolder.caption}, 
        {$set: {
            commentCount: commCount
        }}
    )

    res.redirect("/post/" + postID);
})


// ============== Comment Reporting ==============

router.post("/commReport/:idpost/:idcomm", isAuth, function(req, res){
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
        commentID: commentID,
        dateReported: new Date()
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