const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
    postID:{type: String, required: true},
    username: {type: String, required: true},
    vote: {type: Number, required: true}
});

const Vote = mongoose.model('Votes', votesSchema);

module.exports = Vote;