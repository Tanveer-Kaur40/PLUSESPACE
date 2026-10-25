const crypto = require("crypto");

const users = new Map();
const sessions = new Map();

const hashPassword = (password) =>
    crypto.createHash("sha256").update(password).digest("hex");

const createSession = (user) => {
    const sessionId = crypto.randomBytes(24).toString("hex");
    sessions.set(sessionId, user);
    return sessionId;
};

const setSessionCookie = (res, sessionId) => {
    res.setHeader(
        "Set-Cookie",
        `plusespace_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/`
    );
};

const renderAuthPage = (req, res, page, extraData = {}) => {
    if (res.locals.currentUser) {
        return res.redirect("/home");
    }

    return res.render(`pages/${page}`, extraData);
};

const showLogin = (req, res) => {
    renderAuthPage(req, res, "login", {
        message: req.query.message || null,
        error: req.query.error || null,
        form: {}
    });
};

const showSignup = (req, res) => {
    renderAuthPage(req, res, "signup", {
        error: req.query.error || null,
        form: {}
    });
};

const login = (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";
    const user = users.get(email);

    if (password.length < 8) {
        return res.status(400).render("pages/login", {
            error: "Your password must be at least 8 characters long.",
            message: null,
            form: { email }
        });
    }

    if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).render("pages/login", {
            error: "That email or password is not correct.",
            message: null,
            form: { email }
        });
    }

    setSessionCookie(res, createSession(user));
    return res.redirect("/home");
};

const signup = (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password || "";

    if (!name || !email || password.length < 8) {
        return res.status(400).render("pages/signup", {
            error: "Enter your name, a valid email, and a password with at least 8 characters.",
            form: { name, email }
        });
    }

    if (users.has(email)) {
        return res.status(409).render("pages/signup", {
            error: "An account with that email already exists. Try signing in.",
            form: { name, email }
        });
    }

    const user = {
        name,
        email,
        passwordHash: hashPassword(password),
        followersCount: 0,
        followingCount: 0,
        profileImage: null,
        coverImage: null
    };
    users.set(email, user);
    setSessionCookie(res, createSession(user));
    return res.redirect("/home");
};

const logout = (req, res) => {
    const sessionCookie = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("plusespace_session="));
    const sessionId = sessionCookie?.split("=")[1];

    if (sessionId) {
        sessions.delete(sessionId);
    }

    res.setHeader(
        "Set-Cookie",
        "plusespace_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
    );
    return res.redirect("/");
};

const getUserForSession = (sessionId) => sessions.get(sessionId) || null;

const updateProfile = (req, res) => {
    const { profileImage, coverImage } = req.body;
    const user = res.locals.currentUser;

    for (const image of [profileImage, coverImage]) {
        if (image !== null && image !== undefined && !image.startsWith("data:image/")) {
            return res.status(400).json({ error: "Please choose a valid image." });
        }
    }

    if (profileImage !== undefined) {
        user.profileImage = profileImage;
    }

    if (coverImage !== undefined) {
        user.coverImage = coverImage;
    }

    return res.json({ user });
};

module.exports = {
    getUserForSession,
    login,
    logout,
    showLogin,
    showSignup,
    signup,
    updateProfile
};