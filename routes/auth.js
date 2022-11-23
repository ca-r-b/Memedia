const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersController");

// Login routes
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

// Logout route
router.get("/logout", userController.getLogout);

module.exports = router;