const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

const fs = require("fs");
const path = require('path');

const postController = {
    // ============================ Redirection to upload post page ============================
    getCreatePost: (req, res) => {
        if(req.session.isLoggedIn){
            return res.render("postCreate", {title: "Post Your Meme"});
        }else{
            return res.render("login",  { title: "Login", msg: "Login first to access the post upload feature!" });
        }
    },

    // ============================ Adding of post to database ============================
    postUpload: async (req, res) => {
        // Fetch img
        var img = req.files.postImg;
        // Randomize name
        var imgName = req.session.username + "-" + Date.now() + "-" + img.name;
        var capInput = req.body.postCaption.toString();

        // Redirect to upload folder
        await img.mv(path.resolve(__dirname + '/..', 'public/images/posts', imgName));

        await console.log(path.resolve(__dirname + '/..', 'public/images/posts', imgName));

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
    },

    // ============================ Post deleting ============================
    postDelete: async (req, res) => {
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
    },

    // ============================ Viewing of post ============================
    getPostView: async (req, res) => {
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
    },

    // ============================ Post searching ============================
    postSearch: async (req, res) => {
        const searchInput = req.query.searchInput;

        await Post.find({caption: {$regex: new RegExp(searchInput, 'i')}}).then((results)=>{
            res.render("search", {
                title: "Search Results",
                posts: results
            });
        }).catch((err) => {
            console.log(err);
        })
    },

    // ============================ Default redirections (URL reentering after Post) ============================
    getPostDefault: (req, res) => {
        res.redirect("/home");
    }
}

module.exports = postController;