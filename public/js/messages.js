document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("message-form");
    const input = document.getElementById("message-input");
    const thread = document.getElementById("message-thread");
    const name = document.getElementById("conversation-name");
    const newMessageButton = document.querySelector("[data-new-message]");

    document.querySelectorAll("[data-conversation]").forEach((conversation) => {
        conversation.addEventListener("click", () => {
            document.querySelectorAll(".conversation").forEach((item) => item.classList.remove("active"));
            conversation.classList.add("active");
            name.textContent = conversation.querySelector("strong").textContent;
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = input.value.trim();

        if (!message) {
            return;
        }

        const item = document.createElement("div");
        item.className = "message sent";
        item.textContent = message;
        thread.appendChild(item);
        input.value = "";
        thread.scrollTop = thread.scrollHeight;
    });

    newMessageButton.addEventListener("click", () => {
        input.focus();
    });
});
