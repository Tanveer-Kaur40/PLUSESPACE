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

module.exports = {
    renderAboutPage,
    renderHomePage
};
