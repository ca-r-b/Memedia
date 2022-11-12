const mongoose = require("mongoose");

const repCommSchema = new mongoose.Schema({
    commentID: {type: String, required: true},
    reporterUser: {type: String, required: true},
    remarks: {type: String, required: true},
});

module.exports = mongoose.model('ReportComment', repCommSchema);