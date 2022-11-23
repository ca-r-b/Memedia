const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require('path');

const votesController = {
    // ============================ Voting of posts ============================
    postVote: async (req, res) => {
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
    },
}

module.exports = votesController;