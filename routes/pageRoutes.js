
const express = require("express");
const {
    renderAboutPage,
    renderHomePage,
    renderProfilePage,
    renderBookmarksPage,
    renderCommunitiesPage,
    renderMessagesPage
} = require("../controllers/pageController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", renderAboutPage);
router.get("/home", requireAuth, renderHomePage);
router.get("/profile", requireAuth, renderProfilePage);
router.get("/bookmarks", requireAuth, renderBookmarksPage);
router.get("/communities", requireAuth, renderCommunitiesPage);
router.get("/messages", requireAuth, renderMessagesPage);

module.exports = router;
