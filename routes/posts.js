const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require("fs");
const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// ============== Post Uploading ==============

router.get("/postCreate", function(req, res){
    if(req.session.isLoggedIn){
        return res.render("postCreate", {title: "Post Your Meme"});
    }else{
        return res.render("login",  { title: "Login", msg: "Login first to access the post upload feature!" });
    }
});

router.post("/postUpload", isAuth, async function(req, res){
    var img = req.files.postImg;
    var imgName = req.session.username + "-" + Date.now() + "-" + img.name;

    var capInput = req.body.postCaption.toString();

    // Redirect to upload folder
    await img.mv(path.resolve(__dirname + '/..', 'public/images/posts', imgName));

    const post = new Post({
        username: req.session.username,
        dateCreated: new Date(),
        caption: capInput,
        img: imgName,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0
    })

    await post.save();

    const postsRes = await Post.find().sort({dateCreated: -1});

    res.render("home", {
        title: "Your Main Source of Fun",
        posts: postsRes,
        msg: "Your post has been sucessfully uploaded!"
    });
});

// ============== Post Deleting ==============

router.post("/postDelete/:id", async function(req, res){
    const postID = req.params.id;
    const postHolder = await Post.findById(postID);

    // Remove post image from file directory
    const postImg = path.resolve(__dirname + '/..', 'public/images/posts', postHolder.img);
    fs.unlink(postImg, (err)=>{
        if(err){
            console.log(err);
        }
    })

    await Post.deleteOne({_id: postID});
    await Vote.deleteMany({postID: postID});
    await RepComment.deleteMany({postID: postID});
    await RepPost.deleteMany({postID: postID});
    await Comment.deleteMany({postID: postID});

    const postsRes = await Post.find().sort({dateCreated: -1});

    res.render("home", {
        title: "Your Main Source of Fun",
        posts: postsRes,
        msg: "Your post has been deleted!"
    });
})

// ============== Post Viewing ==============

router.get("/post/:id", async function(req, res){
    const postID = req.params.id;
    const post = await Post.findById(postID);
    const comments = await Comment.find({postID: postID}).sort({date: -1});

    if(!post){
        res.redirect("/home");
    }

    const postUser = await User.findOne({username: post.username});

    if(!postUser){
        res.redirect("/home");
    }

    if(!comments){
        console.log("No Comments.");
    }

    if(req.session.isLoggedIn){
        const searchVote = await Vote.findOne({username: req.session.username, postID: postID});

        if(!searchVote){
            const addVote = new Vote({
                postID: postID,
                username: req.session.username,
                vote: 0
            });

            addVote.save();
        }

        const upvCount = await Vote.count({postID: postID, vote: 1});
        const dvCount = await Vote.count({postID: postID, vote: -1});
        const commCount = await Comment.count({postID: postID});
        
        await Post.updateOne(
            {username: post.username, caption: post.caption}, 
            {$set: {
                upvotes: upvCount,
                downvotes: dvCount,
                commentCount: commCount
            }})
        
        const voteOfUser = await Vote.findOne({username: req.session.username, postID: postID});

        return res.render("postView", {
            title: "Your Main Source of Fun",
            user: postUser,
            post: post,
            comments: comments,
            vote: voteOfUser,
            msg: ""
        })
    }

    return res.render("postView", {
        title: "Your Main Source of Fun",
        user: postUser,
        post: post,
        comments: comments,
        msg: ""
    })
});

// ============== Post Reporting ==============

router.post("/postReport/:id", isAuth, async function(req, res){
    const postID = req.params.id;

    await Post.findById(postID)
        .then((results) => {
            res.render("reportPost", {
                title: "Report Post",
                post: results,
            });
        })
        .catch((err) =>{
            console.log(err);
        });
});

router.post("/confirmPostReport/:id", isAuth, async function(req, res){
    const postID = req.params.id;
    const repType = req.body.reportType;

    const report = new RepPost({
        postID: req.params.id,
        reporterUser: req.session.username, 
        remarks: repType,
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
        msg: "Post reported! We will be reviewing it as soon as possible!"
    });

        // .then(() => {
        //     res.redirect("/post/" + req.params.id);
        // })
        // .catch((err) =>{
        //     res.send(err);
        // });

});

// ============== Post Voting ==============

router.post("/vote/:id", async function(req, res){
    const postID = req.params.id;
    const voter = req.session.username;
    const action = req.body.voteBtn;

    await Vote.updateOne({username: voter, postID: postID}, {$set: {vote: action}});

    const upvCount = await Vote.count({postID: postID, vote: 1});
    const dvCount = await Vote.count({postID: postID, vote: -1});
    const postHolder = await Post.findById(postID);
    
    await Post.updateOne(
        {username: postHolder.username, caption: postHolder.caption}, 
        {$set: {
            upvotes: upvCount,
            downvotes: dvCount
        }});

    res.redirect("/post/" + postID);
})

// ============== Post Searching ==============

router.get("/search", async function(req, res){
    const searchInput = req.query.searchInput;

    await Post.find({caption: {$regex: new RegExp(searchInput, 'i')}}).then((results)=>{
        res.render("search", {
            title: "Search Results",
            posts: results
        });
    }).catch((err) => {
        console.log(err);
    })
})

// ============== Post Creating/Deleting - Redirection pages: After reentering same URL (Removes msg content) ==============

router.get([
    "/postUpload", 
    "/postDelete/:id"
], isAuth, function(req, res){
    res.redirect("/home");
});

router.get("/confirmPostReport/:id", isAuth, function(req, res){
    res.redirect("/post/" + req.params.id);
});


module.exports = router;