const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const Vote = require("../models/votes");

const repCommentsController = {
    getReportComment: async (req, res) => {
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
    },

    postConfirmReport: async (req, res) => {
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
    },

    // ============================ Default redirections (URL reentering after Post) ============================
    getPostDefault: (req, res) => {
        res.redirect("/post/" + req.params.idpost);
    }
}

module.exports = repCommentsController;