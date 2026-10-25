(function () {
    const storageKey = "plusespace-theme";
    const savedTheme = window.localStorage.getItem(storageKey);
    const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";

    document.documentElement.dataset.theme = savedTheme || preferredTheme;

    function updateToggle(toggle) {
        const isLight = document.documentElement.dataset.theme === "light";
        toggle.textContent = isLight ? "☀️" : "🌙";
        toggle.setAttribute("aria-label", isLight ? "Switch to night theme" : "Switch to day theme");
        toggle.setAttribute("aria-pressed", String(isLight));
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-theme-toggle]").forEach(updateToggle);

        document.addEventListener("click", (event) => {
            const toggle = event.target.closest("[data-theme-toggle]");

            if (!toggle) {
                return;
            }

            const nextTheme = document.documentElement.dataset.theme === "light"
                ? "dark"
                : "light";
            document.documentElement.dataset.theme = nextTheme;
            window.localStorage.setItem(storageKey, nextTheme);
            document.querySelectorAll("[data-theme-toggle]").forEach(updateToggle);
        });
    });
})();
