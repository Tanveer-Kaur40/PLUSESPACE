document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("bookmarks-list");
    const emptyState = document.getElementById("empty-bookmarks");
    let savedPosts = [];

    try {
        savedPosts = JSON.parse(localStorage.getItem("plusespace-bookmarks") || "[]");
    } catch {
        savedPosts = [];
    }

    savedPosts.forEach((savedPost) => {
        const template = document.createElement("template");
        template.innerHTML = savedPost.markup.trim();
        const post = template.content.firstElementChild;

        if (post) {
            const saveButton = post.querySelector("[data-save]");
            saveButton?.classList.add("is-active");
            if (saveButton) {
                saveButton.textContent = "Saved";
            }
            list.appendChild(post);
        }
    });

    emptyState.hidden = savedPosts.length > 0;

    list.addEventListener("click", (event) => {
        const saveButton = event.target.closest("[data-save]");

        if (!saveButton) {
            return;
        }

        const post = saveButton.closest("[data-post-id]");
        savedPosts = savedPosts.filter((savedPost) => savedPost.id !== post.dataset.postId);
        localStorage.setItem("plusespace-bookmarks", JSON.stringify(savedPosts));
        post.remove();
        emptyState.hidden = savedPosts.length > 0;
    });
});
