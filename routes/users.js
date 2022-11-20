const express = require("express");
const Post = require("../models/posts");
const User = require("../models/users");
const router = express.Router();

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// TO-DO - DATABASE NEEDED: Add .post of routes

router.get("/user/:profileName", function(req, res){
    const profileName = req.params.profileName;
    console.log(profileName);

    User.findOne({username: profileName})
        .then((userRes) =>{
            Post.find({username: profileName})
                .then((postRes) =>{
                    res.render("userView", {
                        title: "Your Main Source of Fun",
                        users: userRes,
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
});

// Settings

router.get("/settings/:profileName", isAuth, function(req, res){
    const profileName = req.params.profileName;

    if(profileName === req.session.username){
        User.findOne({username: profileName})
        .then((userRes) =>{
            res.render("settings", {
                title: "Account Settings",
                user: userRes
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    }else{
        res.redirect("/");
    }

});

// Settings Update - Email
router.post("/settings/updateEmail/:profileName", isAuth, async function(req, res){
    const profileName = req.params.profileName;
    var emailInput = req.body.updEmail;

    await User.updateOne({username: profileName},{$set: {email: emailInput}});

    req.session.email = await emailInput;

    res.redirect("/settings/" + profileName);
});

// Settings Update - Password
router.post("/settings/updatePass/:profileName", isAuth, async function(req, res){
    const profileName = req.params.profileName;
    var passInput = req.body.updPass;

    await User.updateOne({username: profileName},{$set: {password: passInput}});

    res.redirect("/settings/" + profileName);
});

// Settings Update - Biography
router.post("/settings/updateBio/:profileName", isAuth, async function(req, res){
    const profileName = req.params.profileName;
    var bioInput = req.body.updBio.toString();

    bioInput = bioInput.slice(0, -1);

    await User.updateOne({username: profileName},{$set: {bio: bioInput}});

    res.redirect("/settings/" + profileName);
});


module.exports = router;