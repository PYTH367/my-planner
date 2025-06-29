const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const clearBtn = document.getElementById("clearTasks");
const toggleBtn = document.getElementById("toggleTheme");
const streakDisplay = document.getElementById("streakDisplay");
const rateAppBtn = document.getElementById("rateApp");

function createTask(text = "", checked = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "task";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;

  const taskText = document.createElement("div");
  taskText.className = "task-text";
  taskText.contentEditable = true;
  taskText.innerText = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑️";
  deleteBtn.className = "delete-task";
  deleteBtn.addEventListener("click", () => {
    wrapper.remove();
    saveTasks();
    updateStreakUI();
  });

  if (checked) taskText.classList.add("checked");

  checkbox.addEventListener("change", () => {
    taskText.classList.toggle("checked");
    saveTasks();
    checkStreak();
  });

  taskText.addEventListener("input", saveTasks);

  taskText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  wrapper.appendChild(checkbox);
  wrapper.appendChild(taskText);
  wrapper.appendChild(deleteBtn);
  taskList.appendChild(wrapper);
}

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll(".task")).map(task => {
    return {
      text: task.querySelector(".task-text").innerText,
      checked: task.querySelector("input").checked
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(t => createTask(t.text, t.checked));
  if (saved.length === 0) createTask();
}

function checkStreak() {
  const tasks = Array.from(document.querySelectorAll(".task input"));
  const allChecked = tasks.length > 0 && tasks.every(t => t.checked);

  if (allChecked) {
    const today = new Date().toDateString();
    const lastDone = localStorage.getItem("lastDone");
    let streak = parseInt(localStorage.getItem("streak") || "0");

    if (lastDone !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(lastDone).toDateString() === yesterday.toDateString()) {
        streak += 1;
      } else {
        streak = 1;
      }

      localStorage.setItem("lastDone", today);
      localStorage.setItem("streak", streak);
    }

    updateStreakUI();
  }
}

function updateStreakUI() {
  const streak = parseInt(localStorage.getItem("streak") || "0");
  streakDisplay.innerText = `🔥 Streak: ${streak} day${streak !== 1 ? "s" : ""}`;
}

addTaskBtn.addEventListener("click", () => {
  createTask();
  saveTasks();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
    createTask();
    saveTasks();
  }
});

toggleBtn.addEventListener("click", () => {
  const icon = document.getElementById("themeIcon");
  const isDark = document.body.classList.toggle("dark");
  icon.innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

rateAppBtn.addEventListener("click", () => {
  alert("⭐ Thank you for your feedback! (This would open Play Store in full app)");
});

document.getElementById("resetStreak").addEventListener("click", () => {
  if (confirm("Do you really want to reset your streak?")) {
    localStorage.setItem("streak", "0");
    localStorage.removeItem("lastDone");
    updateStreakUI();
    alert("✅ Your streak has been reset!");
  }
});

(function init() {
  loadTasks();
  updateStreakUI();
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    const icon = document.getElementById("themeIcon");
    icon.innerText = "☀️";
  }
})();
