
const express = require("express");
const {
    renderAboutPage,
    renderHomePage,
    renderProfilePage
} = require("../controllers/pageController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", renderAboutPage);
router.get("/home", requireAuth, renderHomePage);
router.get("/profile", requireAuth, renderProfilePage);

module.exports = router;
