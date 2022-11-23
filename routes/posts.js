const express = require("express");
const router = express.Router();

const postController = require("../controllers/postsController");
const repPostController = require("../controllers/repPostsController");
const votesController = require("../controllers/votesController");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// Post Uploading routes
router.get("/postCreate", postController.getCreatePost);
router.post("/postUpload", isAuth, postController.postUpload);

// Post Deleting route
router.post("/postDelete/:id", postController.postDelete);

// Post Viewing route
router.get("/post/:id", postController.getPostView);

// Post Reporting routes
router.post("/postReport/:id", isAuth, repPostController.postReport);
router.post("/confirmPostReport/:id", isAuth, repPostController.postConfirmReport);

// Post Voting route
router.post("/vote/:id", votesController.postVote);

// Post Searching route
router.get("/search", postController.postSearch);

// Redirection routes
router.get(["/postUpload", "/postDelete/:id"], isAuth, postController.getPostDefault);
router.get("/confirmPostReport/:id", isAuth, repPostController.getPostDefault);


module.exports = router;