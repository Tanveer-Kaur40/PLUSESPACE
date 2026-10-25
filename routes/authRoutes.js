const express = require("express");
const {
    login,
    logout,
    showLogin,
    showSignup,
    signup,
    updateProfile
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(["/login", "/signin"], showLogin);
router.post(["/login", "/signin"], login);
router.get("/signup", showSignup);
router.post("/signup", signup);
router.post("/api/profile", requireAuth, updateProfile);
router.get("/logout", logout);

module.exports = router;