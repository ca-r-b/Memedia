const Post = require("../models/posts");
const Comment = require("../models/comments")

const commentController = {
    // ============================ Comment Adding ============================
    postAddComment: async (req, res) => {
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
    },

    // ============================ Comment Editing ============================
    getEditComment: async (req, res) => {
        const commentFound = await Comment.findById(req.params.idcomm);
        const postFound = await Post.findById(req.params.idpost);

        res.render("editComment", {
            title: "Edit Your Comment",
            comment: commentFound,
            post: postFound
        });
    },

    postEditComment: async (req, res) => {
        const newContent = req.body.editedComment;

        await Comment.updateOne(
            {_id: req.params.idcomm},
            {$set: {
                content: newContent,
                date: new Date()
            }})

        res.redirect("/post/" + req.params.idpost);
    },

    // ============================ Comment Deleting ============================
    postDeleteComment: async (req, res) => {
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
    },

}

module.exports = commentController;