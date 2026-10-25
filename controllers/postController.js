const posts = [];

const createPost = (req, res) => {
    const content = req.body.content?.trim();
    const image = req.body.image || null;

    if (!content && !image) {
        return res.status(400).json({
            error: "Add some text or select an image before publishing."
        });
    }

    if (content && content.length > 2000) {
        return res.status(400).json({
            error: "Posts must be 2000 characters or fewer."
        });
    }

    if (image && !image.startsWith("data:image/")) {
        return res.status(400).json({ error: "The attached image is invalid." });
    }

    const post = {
        id: `${Date.now()}-${posts.length}`,
        authorEmail: res.locals.currentUser.email,
        authorName: res.locals.currentUser.name,
        content: content || "",
        image,
        createdAt: new Date()
    };

    posts.unshift(post);
    return res.status(201).json({ post });
};

const getPostsForUser = (email) =>
    posts.filter((post) => post.authorEmail === email);

module.exports = {
    createPost,
    getPostsForUser
};