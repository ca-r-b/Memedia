const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const Vote = require("../models/votes");

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

    await comment.save();
    
    const commCount = await Comment.count({postID: postID});

    await Post.updateOne(
        {username: postHolder.username, caption: postHolder.caption}, 
        {$set: {
            commentCount: commCount
        }}
    )

    res.redirect("/post/" + postID);
})

// ============== Comment Editing ==============

router.get("/editComment/:idpost/:idcomm", async function(req, res){
    const commentFound = await Comment.findById(req.params.idcomm);
    const postFound = await Post.findById(req.params.idpost);

    res.render("editComment", {
        title: "Edit Your Comment",
        comment: commentFound,
        post: postFound
    });
})

router.post("/editComment/:idpost/:idcomm", isAuth, async function(req, res){
    const newContent = req.body.editedComment;

    await Comment.updateOne(
        {_id: req.params.idcomm},
        {$set: {
            content: newContent,
            date: new Date()
        }})

    res.redirect("/post/" + req.params.idpost);
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

router.get("/commReport/:idpost/:idcomm", isAuth, async function(req, res){
    const postID = req.params.idpost;
    const commentID = req.params.idcomm;

    await Post.findById(postID)
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

router.post("/confirmCommReport/:idpost/:idcomm", isAuth, async function(req, res){ 
    const commentID = req.params.idcomm;
    const postID = req.params.idpost;
    const repType = req.body.reportType;

    const report = new RepComment({
        reporterUser: req.session.username, 
        remarks: repType,
        postID: postID,
        commentID: commentID,
        dateReported: new Date()
    });

    await report.save();

    const postHolder = await Post.findById(postID);
    const postUser = await User.findOne({username: postHolder.username});
    const comments = await Comment.find({postID: postID}).sort({date: -1});
    const voteOfUser = await Vote.findOne({username: req.session.username, postID: postID});

    res.render("postView", {
        title: "Your Main Source of Fun",
        user: postUser,
        post: postHolder,
        comments: comments,
        vote: voteOfUser,
        msg: "Comment reported! We will be reviewing it as soon as possible!"
    });
});

// ============== Post Creating/Deleting - Redirection pages: After reentering same URL (Removes msg content) ==============

router.get("/confirmCommReport/:idpost/:idcomm", isAuth, function(req, res){
    res.redirect("/post/" + req.params.idpost);
});


module.exports = router;