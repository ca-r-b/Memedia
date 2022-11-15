const mongoose = require("mongoose");

const repPostSchema = new mongoose.Schema({
    postID: {type: String, required: true},
    reporterUser: {type: String, required: true},
    remarks: {type: String, required: true},
});

const RepPost = mongoose.model('ReportPost', repPostSchema);

module.exports = RepPost;