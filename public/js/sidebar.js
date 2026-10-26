document.addEventListener("DOMContentLoaded", () => {
    const shell = document.querySelector(".app-shell");
    const toggle = document.querySelector("[data-sidebar-toggle]");

    if (!shell || !toggle) {
        return;
    }

    const storageKey = "plusespace-sidebar-collapsed";
    const setCollapsed = (collapsed) => {
        shell.classList.toggle("sidebar-collapsed", collapsed);
        toggle.textContent = collapsed ? "›" : "‹";
        toggle.setAttribute("aria-expanded", String(!collapsed));
        toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    };

    setCollapsed(window.localStorage.getItem(storageKey) === "true");
    toggle.addEventListener("click", () => {
        const collapsed = !shell.classList.contains("sidebar-collapsed");
        setCollapsed(collapsed);
        window.localStorage.setItem(storageKey, String(collapsed));
    });
});
