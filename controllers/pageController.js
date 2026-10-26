const { getPostsForUser } = require("./postController");

const renderAboutPage = (req, res) => {
    if (res.locals.currentUser) {
        return res.redirect("/home");
    }

    return res.render("pages/about");
};

const renderHomePage = (req, res) => {
    res.render("pages/home", {
        currentUser: res.locals.currentUser
    });
};

const renderProfilePage = (req, res) => {
    const user = res.locals.currentUser;

    return res.render("pages/profile", {
        currentUser: user,
        posts: getPostsForUser(user.email)
    });
};

const renderBookmarksPage = (req, res) => {
    res.render("pages/bookmarks", {
        currentUser: res.locals.currentUser
    });
};

const renderCommunitiesPage = (req, res) => {
    res.render("pages/communities", {
        currentUser: res.locals.currentUser
    });
};

const renderMessagesPage = (req, res) => {
    res.render("pages/messages", {
        currentUser: res.locals.currentUser
    });
};

module.exports = {
    renderAboutPage,
    renderHomePage,
    renderProfilePage,
    renderBookmarksPage,
    renderCommunitiesPage,
    renderMessagesPage
};
