const express = require("express");
const { createPost } = require("../controllers/postController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createPost);

module.exports = router;