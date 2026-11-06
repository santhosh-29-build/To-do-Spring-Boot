
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const allCount = document.getElementById("allCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "todo-management.tasks";

let todos = loadTodos();
let currentFilter = "all";

// Load saved tasks, safely handling unavailable or invalid storage.
function loadTodos() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (!Array.isArray(saved)) return [];

        return saved.filter(todo =>
            todo &&
            typeof todo.id === "string" &&
            typeof todo.title === "string" &&
            typeof todo.completed === "boolean"
        );
    } catch (error) {
        console.warn("Could not load saved tasks:", error);
        return [];
    }
}

// Tasks still work for the current session if storage is unavailable.
function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.warn("Could not save tasks:", error);
    }
}

function createId() {
    return globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Add a task.
todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = todoInput.value.trim();

    if (!title) {
        todoInput.focus();
        return;
    }

    todos.push({
        id: createId(),
        title,
        completed: false
    });

    todoInput.value = "";

    // Ensure the new task is visible, even from the Completed filter.
    currentFilter = "all";

    saveTodos();
    renderTodos();
    todoInput.focus();
});

// Change the active filter.
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

function renderTodos() {
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    allCount.textContent = todos.length;
    activeCount.textContent = activeTodos.length;
    completedCount.textContent = completedTodos.length;

    filterButtons.forEach(button => {
        const selected = button.dataset.filter === currentFilter;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    let visibleTodos = todos;

    if (currentFilter === "active") {
        visibleTodos = activeTodos;
    } else if (currentFilter === "completed") {
        visibleTodos = completedTodos;
    }

    todoList.replaceChildren();

    if (visibleTodos.length === 0) {
        renderEmptyState();
        return;
    }

    visibleTodos.forEach(todo => {
        todoList.appendChild(createTodoItem(todo));
    });
}

function createTodoItem(todo) {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.classList.toggle("completed", todo.completed);
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Complete task: ${todo.title}`);

    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;

        saveTodos();
        renderTodos();
        restoreTaskFocus(todo.id, "checkbox");
    });

    const title = document.createElement("span");
    title.textContent = todo.title;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${todo.title}`);

    deleteButton.addEventListener("click", () => {
        const visibleItems = Array.from(todoList.children);
        const position = visibleItems.indexOf(item);

        todos = todos.filter(task => task.id !== todo.id);

        saveTodos();
        renderTodos();

        const remainingItems = Array.from(
            todoList.querySelectorAll(".todo-item")
        );

        const nextItem =
            remainingItems[position] || remainingItems[position - 1];

        if (nextItem) {
            nextItem.querySelector(".delete-btn").focus();
        } else {
            todoInput.focus();
        }
    });

    item.append(checkbox, title, deleteButton);

    return item;
}

function restoreTaskFocus(id, control) {
    const item = Array.from(todoList.children).find(
        element => element.dataset.id === id
    );

    if (item) {
        const selector =
            control === "checkbox"
                ? 'input[type="checkbox"]'
                : ".delete-btn";

        item.querySelector(selector).focus();
    } else {
        document.querySelector(".filter-btn.active")?.focus();
    }
}

function renderEmptyState() {
    const messages = {
        all: {
            title: "Your day starts here",
            description: "Add your first task to get started."
        },
        active: {
            title: "Nothing left to do",
            description: "Your active task list is clear."
        },
        completed: {
            title: "No completed tasks yet",
            description: "Complete a task and it will appear here."
        }
    };

    const message = messages[currentFilter];

    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.id = "emptyState";

    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "☷";
    icon.setAttribute("aria-hidden", "true");

    const heading = document.createElement("p");
    heading.textContent = message.title;

    const description = document.createElement("span");
    description.textContent = message.description;

    emptyState.append(icon, heading, description);
    todoList.appendChild(emptyState);
}

// Initial display.
renderTodos();