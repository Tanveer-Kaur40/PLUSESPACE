const express = require("express");
const {
    login,
    logout,
    showLogin,
    showSignup,
    signup
} = require("../controllers/authController");

const router = express.Router();

router.get(["/login", "/signin"], showLogin);
router.post(["/login", "/signin"], login);
router.get("/signup", showSignup);
router.post("/signup", signup);
router.get("/logout", logout);

module.exports = router;