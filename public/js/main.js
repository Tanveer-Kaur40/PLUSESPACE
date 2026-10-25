
// document.addEventListener("DOMContentLoaded", () => {
//     const postInput = document.getElementById("post-input");
//     const publishButton = document.getElementById("publish-post");
//     const postsList = document.getElementById("posts-list");
//     const feedFilter = document.getElementById("feed-filter");
//     const composer = document.getElementById("composer");

//     function showMessage(message) {
//         let notice = document.getElementById("app-notice");

//         if (!notice) {
//             notice = document.createElement("div");
//             notice.id = "app-notice";
//             notice.className = "app-notice";
//             notice.setAttribute("role", "status");
//             document.body.appendChild(notice);
//         }

//         notice.textContent = message;
//         notice.classList.add("visible");

//         clearTimeout(notice.timeoutId);
//         notice.timeoutId = setTimeout(() => {
//             notice.classList.remove("visible");
//         }, 2500);
//     }

//     document.querySelectorAll("[data-open-composer]").forEach((button) => {
//         button.addEventListener("click", () => {
//             composer.scrollIntoView({ behavior: "smooth", block: "center" });
//             postInput.focus();
//         });
//     });

//     publishButton.addEventListener("click", () => {
//         const content = postInput.value.trim();

//         if (!content) {
//             showMessage("Please write something before publishing.");
//             postInput.focus();
//             return;
//         }

//         const post = document.createElement("article");
//         post.className = "post-card panel";
//         post.dataset.category = "community";

//         post.innerHTML = `
//             <div class="post-header">
//                 <div class="user-avatar current-user">TK</div>
//                 <div class="post-author">
//                     <h3>Your Profile</h3>
//                     <p>Just now</p>
//                 </div>
//             </div>
//             <div class="post-content"></div>
//             <div class="post-stats">
//                 <span data-like-count>0 likes</span>
//                 <span>0 comments</span>
//                 <span>0 shares</span>
//             </div>
//             <div class="post-actions">
//                 <button type="button" class="post-action" data-like>Like</button>
//                 <button type="button" class="post-action" data-comment>Comment</button>
//                 <button type="button" class="post-action" data-share>Share</button>
//                 <button type="button" class="post-action save-action" data-save>Save</button>
//             </div>
//         `;

//         post.querySelector(".post-content").textContent = content;
//         postsList.prepend(post);
//         postInput.value = "";
//         applyFeedFilter();
//         showMessage("Your post has been published.");
//     });

//     function applyFeedFilter() {
//         const selectedCategory = feedFilter.value;

//         postsList.querySelectorAll(".post-card").forEach((post) => {
//             const matches =
//                 selectedCategory === "all" ||
//                 post.dataset.category === selectedCategory;

//             post.hidden = !matches;
//         });
//     }

//     feedFilter.addEventListener("change", applyFeedFilter);

//     document.addEventListener("click", async (event) => {
//         const button = event.target.closest("button");

//         if (!button) {
//             return;
//         }

//         if (button.matches("[data-like]")) {
//             const post = button.closest(".post-card");
//             const count = post.querySelector("[data-like-count]");
//             const wasLiked = button.classList.toggle("is-active");
//             const currentCount = Number.parseInt(count.textContent, 10) || 0;

//             count.textContent = `${currentCount + (wasLiked ? 1 : -1)} likes`;
//             button.textContent = wasLiked ? "Liked" : "Like";
//         }

//         if (button.matches("[data-save]")) {
//             const isSaved = button.classList.toggle("is-active");
//             button.textContent = isSaved ? "Saved" : "Save";
//             showMessage(isSaved ? "Post saved." : "Post removed from saved items.");
//         }

//         if (button.matches("[data-follow]")) {
//             const isFollowing = button.classList.toggle("is-active");
//             button.textContent = isFollowing ? "Following" : "Follow";
//         }

//         if (button.matches("[data-join]")) {
//             const hasJoined = button.classList.toggle("is-active");
//             button.textContent = hasJoined ? "Joined" : "Join";
//         }

//         if (button.matches("[data-comment]")) {
//             showMessage("Comments will be available in the next feature update.");
//         }

//         if (button.matches("[data-share]")) {
//             const post = button.closest(".post-card");
//             const text = post.querySelector(".post-content").innerText;

//             try {
//                 await navigator.clipboard.writeText(text);
//                 showMessage("Post text copied to clipboard.");
//             } catch {
//                 showMessage("Clipboard access is unavailable in this browser.");
//             }
//         }

//         if (button.matches("[data-view-stories]")) {
//             showMessage("You're viewing the latest stories.");
//         }
//     });
// });




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

    publishButton.addEventListener("click", () => {
        const content = postInput.value.trim();
        const imageFile = imageInput.files[0];

        if (!content && !imageFile) {
            showMessage("Add some text or select an image before publishing.");
            postInput.focus();
            return;
        }

        const post = document.createElement("article");
        post.className = "post-card panel";
        post.dataset.category = "community";

        post.innerHTML = `
            <div class="post-header">
                <div class="user-avatar current-user">TK</div>
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

        if (imageFile && selectedImageUrl) {
            const postImageContainer = post.querySelector(".post-image-container");
            const postImage = post.querySelector(".post-image");

            postImage.src = selectedImageUrl;
            postImageContainer.hidden = false;

            selectedImageUrl = null;
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

