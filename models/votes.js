const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
    postID:{type: String, required: true},
    username: {type: String, required: true},
    vote: {type: Boolean, required: true},
});

module.exports = mongoose.model('Votes', votesSchema);