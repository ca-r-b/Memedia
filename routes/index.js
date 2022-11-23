const express = require("express");
const indexController = require("../controllers/indexController");
const router = express.Router();

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

router.get("/", indexController.getLandingPage);
router.get("/home", isAuth, indexController.getHome);
router.get("/aboutUs", indexController.getAboutUs);

module.exports = router;