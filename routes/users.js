const express = require("express");
const router = express.Router();
const path = require('path');
const Post = require("../models/posts");
const User = require("../models/users"); 

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

router.get("/register", function(req, res){
    res.render("register", {title: "Register Now"});
});

router.post("/register", async function(req, res){
    const username = await req.body.username;
    const password = await req.body.password;
    const email = await req.body.email;

    // validate = findOne
    const findUser = await User.findOne({username: username});

    if(!findUser){
        const user = new User({
            username: username,
            password: password,
            email: email,
            bio: "Hello!",
            img: "default.png",
        })

        await user.save();
    }else{
        // TO-DO: Display that user exists
        console.log("User already exists.");
        return res.redirect("/register");
    }

    res.redirect("/login");
})

router.get("/user/:profileName", function(req, res){
    const profileName = req.params.profileName;

    User.findOne({username: profileName})
        .then((userRes) =>{
            Post.find({username: profileName}).sort({dateCreated: -1})
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

    res.redirect("/settings/" + profileName);
});

// Settings Update - Password
router.post("/settings/updatePass/:profileName", isAuth, async function(req, res){
    const profileName = req.params.profileName;
    var passInput = req.body.updPass;

    await User.updateOne({username: profileName},{$set: {password: passInput}});

    res.redirect("/settings/" + profileName);
});

// Settings Update - Profile Picture
router.post("/settings/updatePfp/:profileName", isAuth, async function(req, res){
    const profileName = req.params.profileName;
    var img = req.files.updPfp;
    var imgName = req.session.username + "-" + img.name;

    // Redirect to upload folder
    await img.mv(path.resolve(__dirname + '/..', 'public/images/pfps', imgName));
    await User.updateOne({username: profileName},{$set: {img: imgName}});

    req.session.img = imgName;

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