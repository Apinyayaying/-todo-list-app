// ---- 1. Grab the DOM elements we need ----
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const dueInput = document.getElementById("due-input");
const list = document.getElementById("task-list");
const countLabel = document.getElementById("task-count");
const progressBar = document.getElementById("progress-bar");
const filterButtons = document.querySelectorAll(".filter-btn");

// ---- 2. App state ----
// Each task is an object: { id, text, completed, dueDate }
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all"; // "all" | "active" | "completed"

// ---- 3. Save current tasks array into localStorage ----
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---- Helper: format "2026-09-05" into something readable like "5 Sep" ----
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ---- Helper: is this date before today (and not completed)? ----
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + "T00:00:00");
  return due < today;
}

// ---- Update the progress bar based on completed vs total tasks ----
function renderProgress() {
  if (tasks.length === 0) {
    progressBar.style.width = "0%";
    return;
  }
  const done = tasks.filter((t) => t.completed).length;
  const percent = Math.round((done / tasks.length) * 100);
  progressBar.style.width = `${percent}%`;
}

// ---- 4. Render the task list based on the current filter ----
function renderTasks() {
  list.innerHTML = ""; // clear the list before re-drawing it

  const visibleTasks = tasks
    .filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true; // "all"
    })
    .slice()
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  // ---- Empty state ----
  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.innerHTML =
      tasks.length === 0
        ? "🌤️<br>Nothing here yet. Add your first task above."
        : "✅<br>No tasks in this view.";
    list.appendChild(empty);
  }

  visibleTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-enter"); // triggers the fade/slide-in animation
    li.style.animationDelay = `${index * 40}ms`; // slight stagger, nicer to look at
    if (task.completed) li.classList.add("completed");
    if (isOverdue(task)) li.classList.add("overdue");

    // Text (click to toggle complete)
    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(task.id));
    li.appendChild(span);

    // Due date badge (only shown if a date was set)
    if (task.dueDate) {
      const dateBadge = document.createElement("span");
      dateBadge.className = "due-badge";
      dateBadge.textContent = formatDate(task.dueDate);
      li.appendChild(dateBadge);
    }

    // Delete button — fades the row out, THEN removes it from state
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => {
      li.classList.add("task-exit"); // start fade/slide-out animation
      li.addEventListener(
        "animationend",
        () => deleteTask(task.id),
        { once: true }
      );
    });
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  countLabel.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} left`;
  renderProgress();
}

// ---- 5. Actions: add / toggle / delete ----
function addTask(text, dueDate) {
  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    dueDate: dueDate || "",
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// ---- 6. Event listeners ----
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  addTask(text, dueInput.value);
  input.value = "";
  dueInput.value = "";
  input.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---- 7. Initial render on page load ----
renderTasks();
