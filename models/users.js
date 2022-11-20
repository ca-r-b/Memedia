const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, min: 5, max: 15, required: true},
    password: {type: String, min: 8, max: 16, required: true},
    email: {type: String, required: true},
    bio: {type: String, max: 200, required: false},
    img: {type: String, required: false},
});

const User = mongoose.model('User', userSchema);

module.exports = User;