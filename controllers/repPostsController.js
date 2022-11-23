const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

const repPostsController = {
    // ============================ For post reports ============================
    postReport: async (req, res) => {
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
    },

    // ============================ Confirming of post report ============================
    postConfirmReport: async (req, res) => {
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
    },

    // ============================ Default redirections (URL reentering after Post) ============================
    getPostDefault: (req, res) => {
        res.redirect("/post/" + req.params.id);
    }
}

module.exports = repPostsController;