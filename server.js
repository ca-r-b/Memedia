require('dotenv').config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/memedia";

// Session
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);

const atlas = "mongodb+srv://memedia_database:" + process.env.ATLAS_PASSWORD + "@cluster0.skaff1k.mongodb.net/memedia"

const app = express();

// Setup MongoDB Connection

// mongoose.connect(mongoURI, {useNewUrlParser: true})
//     .then((result) => console.log("Connected to DB!"))
//     .catch((err) => console.log(err));
mongoose.connect(atlas);

const store = new MongoDBSession({
    uri: atlas,
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
}));

// Store LOCAL session variables
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
}); 

app.listen(process.env.PORT || 3000, function(){
    console.log("Server now running on port 3000");
});

// Routes
app.use("/", authRouter );
app.use("/", commentsRouter);
app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", usersRouter);