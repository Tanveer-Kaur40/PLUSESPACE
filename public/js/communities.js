document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-join]");

        if (!button) {
            return;
        }

        const joined = button.classList.toggle("is-active");
        button.textContent = joined ? "Joined" : "Join community";
    });
});
