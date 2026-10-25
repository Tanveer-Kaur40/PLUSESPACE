
const express = require("express");
const path = require("path");
require("dotenv").config();

const pageRoutes = require("./routes/pageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", pageRoutes);

app.listen(PORT, () => {
    console.log(`PulseSpace server running at http://localhost:${PORT}`);
});
