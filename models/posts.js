const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: {type: String, min: 8, max: 16, required: true},
    dateCreated: {type: Date, required: true},
    caption: {type: String, min: 3, max: 100, required: true},
    img: {type: String, required: true},
    upvotes: {type: Number, required: true},
    downvotes: {type: Number, required: true}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;