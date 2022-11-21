const express = require("express");
const router = express.Router();
const path = require('path');
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

router.get("/postCreate", isAuth, function(req, res){
    res.render("postCreate", {title: "Post Your Meme"});
});

router.post("/postUpload", isAuth, async function(req, res){
    var img = req.files.postImg;
    var imgName = req.session.username + "-" + img.name;

    var capInput = req.body.postCaption.toString();

    // Redirect to upload folder
    await img.mv(path.resolve(__dirname + '/..', 'public/images/posts', imgName));

    const post = new Post({
        username: req.session.username,
        dateCreated: new Date(),
        caption: capInput,
        img: imgName,
        upvotes: 0,
        downvotes: 0
    })

    post.save()
        .then((result) => {
            res.redirect("/postCreate");
        })
        .catch((err) =>{
            res.send(err);
        });
});

// ============== Post Viewing ==============

router.get("/post/:id", async function(req, res){
    const postID = req.params.id;

    const post = await Post.findById(postID);
    const comments = await Comment.find({postID: postID});
    const vote = await Vote.findOne({username: req.session.username, postID: postID});

    if(!post){
        console.log("Problem: Post");
        res.redirect("/home");
    }
    const postUser = await User.findOne({username: post.username});

    if(!postUser){
        console.log("Problem: Poster");
        res.redirect("/home");
    }

    if(!comments){
        console.log("Problem: Comments");
    }

    if(!vote){
        const addVote = new Vote({
            postID: postID,
            username: req.session.username,
            vote: 0
        });

        addVote.save()
            .then((result) => {
                console.log("Success.");
            }).catch((err) =>{
                console.log(err);
            });
    }

    // TO-DO: Add vote to post

    const upvCount = await Vote.count({postID: postID, vote: 1});
    const dvCount = await Vote.count({postID: postID, vote: -1});

    console.log(upvCount + " " + dvCount)
    
    await Post.updateOne(
        {username: post.username, postID: postID}, 
        {$set: {
            upvotes: upvCount,
            downvotes: 0 - dvCount
        }});

    res.render("postView", {
        title: "Your Main Source of Fun",
        user: postUser,
        post: post,
        comments: comments
    })

});


// ============== Post Reporting ==============

router.post("/postReport/:id", isAuth, async function(req, res){
    const postID = req.params.id;
    console.log(postID)

    await Post.findById(postID)
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

router.post("/confirmPostReport/:id", isAuth, async function(req, res){
    var repType = req.body.reportType;

    console.log(repType);

    const report = new RepPost({
        postID: req.params.id,
        reporterUser: req.session.username, 
        remarks: repType
    });

    await report.save()
        .then((result) => {
            res.redirect("/post/" + req.params.id);
        })
        .catch((err) =>{
            res.send(err);
        });

});

// ============== Post Voting ==============

router.post("/vote/:id", async function(req, res){
    var postID = req.params.id;
    var voter = req.session.username;
    var action = req.body.voteBtn;

    await Vote.updateOne({username: voter, postID: postID}, {$set: {vote: action}});

    const upvCount = await Vote.count({postID: postID, vote: 1});
    const dvCount = await Vote.count({postID: postID, vote: -1});
    const poster = await Post.findById(postID);
    
    await Post.updateOne(
        {username: poster.username, postID: postID}, 
        {$set: {
            upvotes: upvCount,
            downvotes: 0 - dvCount
        }});

    res.redirect("/post/" + postID);
})

// ============== Post Searching ==============

router.get("/search", async function(req, res){
    const searchInput = req.query.searchInput;

    await Post.find({caption: {$regex: new RegExp(searchInput)}}).then((results)=>{
        res.render("search", {
            title: "Search Results",
            posts: results
        });
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;