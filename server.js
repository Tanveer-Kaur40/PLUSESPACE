
const express = require("express");
const path = require("path");
require("dotenv").config();

const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { attachCurrentUser } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "7mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(attachCurrentUser);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log(`PulseSpace server running at http://localhost:${PORT}`);
});
