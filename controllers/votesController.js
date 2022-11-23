const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require('path');

module.exports = votesController;