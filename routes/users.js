const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersController");

// Session Checking - Check if authenticated
const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};

// Registration routes
router.get("/register", userController.getRegister);
router.post("/register", userController.postRegister);

// Profile Viewing route
router.get("/user/:profileName", userController.getProfile);

// Settings routes
router.get("/settings/:profileName", isAuth, userController.getSettings);
router.post("/settings/updateUser/:profileName", isAuth, userController.postUpdateBasic);
router.post("/settings/updatePass/:profileName", isAuth, userController.postUpdatePass);
router.post("/settings/updatePfp/:profileName", isAuth, userController.postUpdatePfp);
router.post("/settings/updateBio/:profileName", isAuth, userController.postUpdateBio);

// Redirection routes after reentering same URL
router.get(["/settings/updateUser/:profileName", "/settings/updatePfp/:profileName", "/settings/updatePass/:profileName", "/settings/updateBio/:profileName"], isAuth, userController.getPostDefault);


module.exports = router;