(() => {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task");

    if (!form || !input) return;

    form.addEventListener("submit", (event) => {
        const value = input.value.trim();

        if (!value) {
            event.preventDefault();
            input.focus();
            return;
        }

        input.value = value;
    });

    input.addEventListener("input", () => {
        input.setCustomValidity("");
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const confirmed = window.confirm("Delete this task?");

            if (!confirmed) {
                event.preventDefault();
            }
        });
    });
})();