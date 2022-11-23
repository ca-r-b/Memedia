const Post = require("../models/posts");

const indexController = {
    getLandingPage: (req, res) => {
        if(req.session.isAuth){
            res.redirect("/home");
        }else{
            Post.find().sort({dateCreated: -1})
                .then((result) =>{
                    res.render("index", {
                        title: "Your Main Source of Fun",
                        posts: result
                    });
                })
                .catch((err) =>{
                    console.log(err);
                });
        }
    },

    getHome: async (req, res) => {
        Post.find().sort({dateCreated: -1})
        .then((result) =>{
            res.render("home", {
                title: "Your Main Source of Fun",
                posts: result,
                msg: ""
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    },

    getAboutUs: (req, res) => {
        res.render("aboutUs", {title: "About Us"});
    }
}

module.exports = indexController;