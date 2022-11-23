const express = require("express");
const router = express.Router();

const postController = require("../controllers/postsController");
const repPostController = require("../controllers/repPostsController");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// Post Uploading
router.get("/postCreate", postController.getCreatePost);
router.post("/postUpload", isAuth, postController.postUpload);

// Post Deleting
router.post("/postDelete/:id", postController.postDelete);

// Post Viewing
router.get("/post/:id", postController.getPostView);

// Post Reporting
router.post("/postReport/:id", isAuth, repPostController.postReport);
router.post("/confirmPostReport/:id", isAuth, repPostController.postConfirmReport);

// Post Voting
router.post("/vote/:id", postController.postVote);

// Post Searching
router.get("/search", postController.postSearch);

// Redirection routes
router.get(["/postUpload", "/postDelete/:id"], isAuth, postController.getDefault1);
router.get("/confirmPostReport/:id", isAuth, postController.getDefault2);


module.exports = router;