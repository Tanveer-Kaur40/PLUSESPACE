const { getUserForSession } = require("../controllers/authController");

const attachCurrentUser = (req, res, next) => {
    const sessionId = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("plusespace_session="))
        ?.split("=")[1];

    res.locals.currentUser = sessionId ? getUserForSession(sessionId) : null;
    next();
};

const requireAuth = (req, res, next) => {
    if (!res.locals.currentUser) {
        return res.redirect("/login?message=Please%20sign%20in%20to%20view%20your%20feed.");
    }

    return next();
};

module.exports = {
    attachCurrentUser,
    requireAuth
};