const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/memedia";

// Session
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);

// Schemas
const Comment = require("./models/comments.js");
const Post = require("./models/posts.js");
const RepComment = require("./models/reportComments.js");
const RepPost = require("./models/reportPosts.js");
const Vote = require("./models/votes.js");
const User = require("./models/users.js");

const app = express();

// Setup MongoDB Connection
mongoose.connect(mongoURI, {useNewUrlParser: true})
    .then((result) => console.log("Connected to DB!"))
    .catch((err) => console.log(err));

const store = new MongoDBSession({
    uri: mongoURI,
    collection: "sessions"
})

// Setup routes
const authRouter = require("./routes/auth.js");
const commentsRouter = require("./routes/comments.js");
const indexRouter = require("./routes/index.js");
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");

app.set("view engine", "ejs");

app.use(fileUpload());
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Session
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    isLoggedIn: false
    // cookie: { maxAge: 60000}
}));

// Store session variables
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
}); 

app.listen(3000, function(){
    console.log("Server now running on port 3000");
});

// Routes
app.use("/", authRouter );
app.use("/", commentsRouter);
app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", usersRouter);