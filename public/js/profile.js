document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("profile-editor");
    const openButton = document.querySelector("[data-open-profile-editor]");
    const closeButton = document.querySelector("[data-close-profile-editor]");
    const saveButton = document.querySelector("[data-save-profile]");
    const status = document.querySelector("[data-profile-status]");
    const profileInput = document.querySelector("[data-profile-image]");
    const coverInput = document.querySelector("[data-cover-image]");

    const readImageAsDataUrl = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", () => reject(new Error("Unable to read image.")));
            reader.readAsDataURL(file);
        });

    const getImage = async (input) => {
        const file = input.files[0];

        if (!file) {
            return undefined;
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Images must be smaller than 5 MB.");
        }

        return readImageAsDataUrl(file);
    };

    openButton.addEventListener("click", () => {
        editor.hidden = false;
        editor.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    closeButton.addEventListener("click", () => {
        editor.hidden = true;
    });

    saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;
        status.textContent = "Saving...";

        try {
            const [profileImage, coverImage] = await Promise.all([
                getImage(profileInput),
                getImage(coverInput)
            ]);
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileImage, coverImage })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Unable to save profile changes.");
            }

            status.textContent = "Saved. Refreshing...";
            window.location.reload();
        } catch (error) {
            status.textContent = error.message;
            saveButton.disabled = false;
        }
    });
});
