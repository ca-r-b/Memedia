const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Setup MongoDB Connection
// mongoose.connect("mongodb://localhost:27017/memediadb", {useNewUrlParser: true});

// Setup routes
const authRouter = require("./routes/auth.js");
const commentsRouter = require("./routes/comments.js");
const indexRouter = require("./routes/index.js");
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");

const app = express();

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(){
    console.log("Server now running on port 3000");
});

// ROUTES
// NOTE: These routes are TENTATIVE
//          1. Must be in Routes folder
//          2. Must use the appropriate HTTP methods (get vs post)
//          3. SOME ROUTES COULD STILL BE MISSING

app.use("/", authRouter );
app.use("/", commentsRouter);
app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", usersRouter);