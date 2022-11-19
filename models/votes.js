const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
    postID:{type: String, required: true},
    username: {type: String, required: true},
    vote: {type: Number, required: true},
        // If vote === -1 -> Downvote
        // If vote === 1 -> Upvote 
});

const Vote = mongoose.model('Votes', votesSchema);

module.exports = Vote;