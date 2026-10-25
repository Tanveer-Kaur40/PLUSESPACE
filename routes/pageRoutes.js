
const express = require("express");
const { renderHomePage } = require("../controllers/pageController");

const router = express.Router();

router.get("/", renderHomePage);

module.exports = router;
