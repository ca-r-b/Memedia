const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postID:{type: String, required: true},
    username: {type: String, required: true},
    date: {type: Date, required: true},
    content: {type: String, min: 3, max: 256, required: true}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;