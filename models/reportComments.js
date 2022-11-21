const mongoose = require("mongoose");

const repCommSchema = new mongoose.Schema({
    commentID: {type: String, required: true},
    reporterUser: {type: String, required: true},
    remarks: {type: String, required: true},
    dateReported: {type: Date, required: true}
});

const RepComment = mongoose.model('ReportComment', repCommSchema);

module.exports = RepComment;