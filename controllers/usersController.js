const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comments")
const RepComment = require("../models/reportComments");
const RepPost = require("../models/reportPosts");
const Vote = require("../models/votes");

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require('path');

const userController = {
    // ============================ Login & Logout ============================
    getLogin: (req, res) => {
        if(!req.session.isLoggedIn){
            res.render("login", {title: "Login", msg: ""});
        }else{
            res.redirect("/home");
        }
    },

    postLogin: async (req, res) => {
        const {username, password} = req.body;

        const loggedUser = await User.findOne({username: username});

        if(!loggedUser){
            return res.render("login", {title: "Login", msg: "Invalid username! Please try again."});
        }

        const isCorrect = await bcrypt.compare(password, loggedUser.password);

        if(!isCorrect){
            return res.render("login", {title: "Login", msg: "Incorrect password! Please try again."});
        }

        // Assign session variables
        req.session.isAuth = true;
        req.session.isLoggedIn = true;
        req.session.username = loggedUser.username;
        req.session.img = loggedUser.img;
        res.redirect("/home");
    },

    getLogout: (req, res) => {
        req.session.destroy((err) => {
            if(err) throw err;
            res.redirect("/");
        })
    },

    // ============================ Registration ============================
    getRegister: (req, res) => {
        res.render("register", {
            title: "Register Now",
            msg:""
        });
    },

    postRegister: async (req, res) => {
        const username = await req.body.username;
        const password = await req.body.password;
        const email = await req.body.email;

        const findUser = await User.findOne({username: username});
        const findEmail = await User.findOne({email: email});

        if(!findUser){
            if(!findEmail){
                const hashPass = await bcrypt.hash(password, 10);

                const user = new User({
                    username: username,
                    password: hashPass,
                    email: email,
                    bio: "Hello!",
                    img: "default.png",
                })

                await user.save();
            }else{
                return res.render("register", {
                    title: "Register Now",
                    msg:"Email address is already taken! Please try another email."
                });
            } 
        }else{
            return res.render("register", {
                title: "Register Now",
                msg:"Username is already taken! Please try another name."
            });
        }

        return res.render("register", {
            title: "Register Now",
            msg:"Account created successfully!"
        });
    },

    // ============================ Visit Profile ============================
    getProfile: (req, res) => {
        const profileName = req.params.profileName;

        User.findOne({username: profileName})
            .then((userRes) =>{
                Post.find({username: profileName}).sort({dateCreated: -1})
                    .then((postRes) =>{
                        res.render("userView", {
                            title: "Your Main Source of Fun",
                            user: userRes,
                            posts: postRes
                        });
                    })
                    .catch((err) =>{
                        console.log(err);
                    });
            })
            .catch((err) =>{
                console.log(err);
            });
    },

    // ============================ Visit Settings ============================
    getSettings: (req, res) => {
        const profileName = req.params.profileName;

        if(profileName === req.session.username){
            User.findOne({username: profileName})
            .then((userRes) =>{
                res.render("settings", {
                    title: "Account Settings",
                    user: userRes,
                    msg: ""
                });
            })
            .catch((err) =>{
                console.log(err);
            });
        }else{
            res.redirect("/");
        }
    },

    // ============================ Settings Update - Email & Username ============================
    postUpdateBasic: async (req, res) => {
        const profileName = req.params.profileName;
        const usernameInput = req.body.updUser;
        const emailInput = req.body.updEmail;

        // Store unupdated profile temporarily
        const profileTemp = await User.findOne({username: profileName});

        // Search if new username is already taken
        const searchUser = await User.findOne({username: usernameInput});
        const searchEmail = await User.findOne({email: emailInput});

        // Variables for validity
        var validUser = true;
        var validEmail = true; 

        if(searchUser){
            if(searchUser._id.toString() !== profileTemp._id.toString()){
                validUser = false;
            }
        }

        if(searchEmail){
            if(searchEmail._id.toString() !== profileTemp._id.toString()){
                validEmail = false;
            }
        }

        // If user with "new username" does not exist / the user found is himself
        if(validUser){
            // If user with "new email" does not exist / the user found is himself
            if(validEmail){
                // Find possible user posts, votes, comments and reports
                const searchPosts = await Post.find({username: profileName});
                const searchVotes = await Vote.find({username: profileName});
                const searchComms = await Comment.find({username: profileName});
                const searchRepPosts = await RepPost.find({reporterUser: profileName});
                const searchRepComms = await RepComment.find({reporterUser: profileName});

                if(searchPosts){
                    await Post.updateMany({username: profileName},{$set: {username: usernameInput}});
                }

                if(searchVotes){
                    await Vote.updateMany({username: profileName},{$set: {username: usernameInput}});
                }

                if(searchComms){
                    await Comment.updateMany({username: profileName},{$set: {username: usernameInput}});
                }

                if(searchRepPosts){
                    await RepPost.updateMany({reporterUser: profileName},{$set: {reporterUser: usernameInput}});
                }

                if(searchRepComms){
                    await RepComment.updateMany({reporterUser: profileName},{$set: {reporterUser: usernameInput}});
                }

                // Update user
                await User.updateOne(
                    {username: profileName},
                    {$set: 
                        {
                            username: usernameInput,
                            email: emailInput
                        }
                    });

                const profileHolder = await User.findOne({username: usernameInput});

                req.session.username = usernameInput;

                res.render("settings", {
                    title: "Account Settings",
                    user: profileHolder,
                    msg: "New email and username saved."
                });
            }else{
                res.render("settings", {
                    title: "Account Settings",
                    user: profileTemp,
                    msg: "Email is already taken."
                });
            }
        }else{
            res.render("settings", {
                title: "Account Settings",
                user: profileTemp,
                msg: "Username is already taken."
            });
        }
    },

    // ============================ Settings Update - Password ============================
    postUpdatePass: async (req, res) => {
        const profileName = req.params.profileName;
        const passInput = req.body.updPass;

        const hashPass = await bcrypt.hash(passInput, 10);

        await User.updateOne({username: profileName},{$set: {password: hashPass}});

        const profileHolder = await User.findOne({username: profileName});

        res.render("settings", {
            title: "Account Settings",
            user: profileHolder,
            msg: "New password saved."
        });
    },

    // ============================ Settings Update - Profile Picture ============================
    postUpdatePfp: async (req, res) => {
        const profileName = req.params.profileName;
        var img = req.files.updPfp;
        var imgName = req.session.username + "-" + Date.now() + "-" + img.name;

        // Remove current image from file directory
        if(!(req.session.img === "default.png")){
            const oldPfp = path.resolve(__dirname + '/..', 'public/images/pfps', req.session.img);
            fs.unlink(oldPfp, (err)=>{
                if(err){
                    console.log(err);
                }
            })
        }

        // Redirect to upload folder
        await img.mv(path.resolve(__dirname + '/..', 'public/images/pfps', imgName));

        // Set variables
        await User.updateOne({username: profileName},{$set: {img: imgName}});
        req.session.img = imgName;

        const profileHolder = await User.findOne({username: profileName});

        res.render("settings", {
            title: "Account Settings",
            user: profileHolder,
            msg: "New profile picture saved."
        });
    },

    // ============================ Settings Update - Biography ============================
    postUpdateBio: async (req, res) => {
        const profileName = req.params.profileName;
        var bioInput = req.body.updBio.toString();

        bioInput = bioInput.slice(0, -1);

        await User.updateOne({username: profileName},{$set: {bio: bioInput}});

        const profileHolder = await User.findOne({username: profileName});

        res.render("settings", {
            title: "Account Settings",
            user: profileHolder,
            msg: "New profile biography saved."
        });
    },

    // ============================ Default redirections (URL reentering after Post) ============================
    getPostDefault: (req, res) => {
        res.redirect("/settings/" + req.params.profileName);
    }
}

module.exports = userController;