
const express = require("express");
const { renderAboutPage, renderHomePage } = require("../controllers/pageController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", renderAboutPage);
router.get("/home", requireAuth, renderHomePage);

module.exports = router;
