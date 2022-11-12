const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
    postID:{type: String, required: true},
    username: {type: String, required: true},
    vote: {type: Boolean, required: true},
        // If vote === 0 -> Downvote
        // If vote === 1 -> Upvote 
});

module.exports = mongoose.model('Votes', votesSchema);