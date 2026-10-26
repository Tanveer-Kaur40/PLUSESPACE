document.addEventListener("DOMContentLoaded", () => {
    const postInput = document.getElementById("post-input");
    const publishButton = document.getElementById("publish-post");
    const postsList = document.getElementById("posts-list");
    const feedFilter = document.getElementById("feed-filter");
    const composer = document.getElementById("composer");
    const imageInput = document.getElementById("image-input");
    const imagePreview = document.getElementById("image-preview");
    const selectedImage = document.getElementById("selected-image");
    const removeImageButton = document.getElementById("remove-image");

    let selectedImageUrl = null;

    function showMessage(message) {
        let notice = document.getElementById("app-notice");

        if (!notice) {
            notice = document.createElement("div");
            notice.id = "app-notice";
            notice.className = "app-notice";
            notice.setAttribute("role", "status");
            document.body.appendChild(notice);
        }

        notice.textContent = message;
        notice.classList.add("visible");

        clearTimeout(notice.timeoutId);
        notice.timeoutId = setTimeout(() => {
            notice.classList.remove("visible");
        }, 2500);
    }

    function clearSelectedImage() {
        if (selectedImageUrl) {
            URL.revokeObjectURL(selectedImageUrl);
        }

        selectedImageUrl = null;
        selectedImage.src = "";
        imageInput.value = "";
        imagePreview.hidden = true;
    }

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];

        clearSelectedImage();

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!allowedTypes.includes(file.type)) {
            showMessage("Please select a JPG, PNG, WEBP or GIF image.");
            imageInput.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showMessage("Please select an image smaller than 5 MB.");
            imageInput.value = "";
            return;
        }

        selectedImageUrl = URL.createObjectURL(file);
        selectedImage.src = selectedImageUrl;
        imagePreview.hidden = false;
    });

    removeImageButton.addEventListener("click", clearSelectedImage);

    document.querySelectorAll("[data-open-composer]").forEach((button) => {
        button.addEventListener("click", () => {
            composer.scrollIntoView({ behavior: "smooth", block: "center" });
            postInput.focus();
        });
    });

    function applyFeedFilter() {
        const selectedCategory = feedFilter.value;

        postsList.querySelectorAll(".post-card").forEach((post) => {
            const matches =
                selectedCategory === "all" ||
                post.dataset.category === selectedCategory;

            post.hidden = !matches;
        });
    }

    function readImageAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", () => reject(new Error("Unable to read image.")));
            reader.readAsDataURL(file);
        });
    }

    const avatarElement = document.querySelector("[data-current-avatar-image]");
    const avatarInitials = document.querySelector("[data-current-avatar]")?.textContent.trim() || "ME";
    const avatarMarkup = avatarElement
        ? `<img class="user-avatar current-user avatar-image" src="${avatarElement.src}" alt="Your profile image">`
        : `<div class="user-avatar current-user" data-current-avatar>${avatarInitials}</div>`;

    function getSavedPosts() {
        try {
            return JSON.parse(localStorage.getItem("plusespace-bookmarks") || "[]");
        } catch {
            return [];
        }
    }

    function savePosts(savedPosts) {
        localStorage.setItem("plusespace-bookmarks", JSON.stringify(savedPosts));
    }

    function bookmarkPost(post, saved) {
        const postId = post.dataset.postId;
        const savedPosts = getSavedPosts().filter((item) => item.id !== postId);

        if (saved) {
            savedPosts.push({
                id: postId,
                markup: post.outerHTML
            });
        }

        savePosts(savedPosts);
    }

    function restoreBookmarks() {
        const savedIds = new Set(getSavedPosts().map((item) => item.id));

        postsList.querySelectorAll("[data-post-id]").forEach((post) => {
            const saveButton = post.querySelector("[data-save]");
            const isSaved = savedIds.has(post.dataset.postId);

            saveButton.classList.toggle("is-active", isSaved);
            saveButton.textContent = isSaved ? "Saved" : "Save";
        });
    }

    restoreBookmarks();

    publishButton.addEventListener("click", async () => {
        const content = postInput.value.trim();
        const imageFile = imageInput.files[0];

        if (!content && !imageFile) {
            showMessage("Add some text or select an image before publishing.");
            postInput.focus();
            return;
        }

        publishButton.disabled = true;

        let imageData = null;
        try {
            imageData = imageFile ? await readImageAsDataUrl(imageFile) : null;
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, image: imageData })
            });

            const result = await response.json();
            if (!response.ok) {
                showMessage(result.error || "Your post could not be published.");
                return;
            }
        } catch (error) {
            showMessage("Your post could not be published. Please try again.");
            return;
        } finally {
            publishButton.disabled = false;
        }

        const post = document.createElement("article");
        post.className = "post-card panel";
        post.dataset.postId = `post-${Date.now()}`;
        post.dataset.category = "community";

        post.innerHTML = `
            <div class="post-header">
                ${avatarMarkup}
                <div class="post-author">
                    <h3>Your Profile</h3>
                    <p>Just now</p>
                </div>
                <button class="more-button" type="button"
                    aria-label="More post options">More</button>
            </div>
            <div class="post-content"></div>
            <div class="post-image-container" hidden>
                <img class="post-image" alt="Image attached to post">
            </div>
            <div class="post-stats">
                <span data-like-count>0 likes</span>
                <span>0 comments</span>
                <span>0 shares</span>
            </div>
            <div class="post-actions">
                <button type="button" class="post-action" data-like>Like</button>
                <button type="button" class="post-action" data-comment>Comment</button>
                <button type="button" class="post-action" data-share>Share</button>
                <button type="button" class="post-action save-action" data-save>Save</button>
            </div>
        `;

        post.querySelector(".post-content").textContent = content;

        if (imageData) {
            const postImageContainer = post.querySelector(".post-image-container");
            const postImage = post.querySelector(".post-image");

            postImage.src = imageData;
            postImageContainer.hidden = false;
        }

        postsList.prepend(post);
        postInput.value = "";
        clearSelectedImage();
        applyFeedFilter();
        showMessage("Your post has been published.");
    });

    feedFilter.addEventListener("change", applyFeedFilter);

    document.addEventListener("click", async (event) => {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        if (button.matches("[data-like]")) {
            const post = button.closest(".post-card");
            const count = post.querySelector("[data-like-count]");
            const wasLiked = button.classList.toggle("is-active");
            const currentCount = Number.parseInt(count.textContent, 10) || 0;

            count.textContent = `${currentCount + (wasLiked ? 1 : -1)} likes`;
            button.textContent = wasLiked ? "Liked" : "Like";
        }

        if (button.matches("[data-save]")) {
            const isSaved = button.classList.toggle("is-active");
            button.textContent = isSaved ? "Saved" : "Save";
            bookmarkPost(button.closest(".post-card"), isSaved);
            showMessage(isSaved ? "Post saved." : "Post removed from saved items.");
        }

        if (button.matches("[data-follow]")) {
            const isFollowing = button.classList.toggle("is-active");
            button.textContent = isFollowing ? "Following" : "Follow";
        }

        if (button.matches("[data-join]")) {
            const hasJoined = button.classList.toggle("is-active");
            button.textContent = hasJoined ? "Joined" : "Join";
        }

        if (button.matches("[data-comment]")) {
            showMessage("Comments will be available in a future update.");
        }

        if (button.matches("[data-share]")) {
            const post = button.closest(".post-card");
            const text = post.querySelector(".post-content").innerText;

            try {
                await navigator.clipboard.writeText(text);
                showMessage("Post text copied to clipboard.");
            } catch {
                showMessage("Clipboard access is unavailable in this browser.");
            }
        }

        if (button.matches("[data-view-stories]")) {
            showMessage("You're viewing the latest stories.");
        }
    });
});
