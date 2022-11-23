const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/commentsController");
const repCommentsController = require("../controllers/repCommentsController");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// Comment Adding
router.post("/addComment/:idpost", isAuth, commentsController.postAddComment);

// Comment Editing
router.get("/editComment/:idpost/:idcomm", commentsController.getEditComment);
router.post("/editComment/:idpost/:idcomm", isAuth, commentsController.postEditComment);

// Comment Deleting
router.post("/deleteComment/:idpost/:idcomm", isAuth, commentsController.postDeleteComment);

// Comment Reporting
router.get("/commReport/:idpost/:idcomm", isAuth, repCommentsController.getReportComment);
router.post("/confirmCommReport/:idpost/:idcomm", isAuth, repCommentsController.postConfirmReport);

// Redirection pages
router.get("/confirmCommReport/:idpost/:idcomm", isAuth, repCommentsController.getPostDefault);

module.exports = router;