import "./styles.css";

import { Task } from "./tasks.js";
import { Category } from "./categories.js";
import { Store } from "./store.js";

// Wiring
const newTaskForm = document.querySelector("#new-task-form");
const newTaskDialog = document.querySelector("#new-task-dialog");
const newTaskBtn = document.querySelector("#new-task-btn");
const taskList = document.querySelector(".task-list");
const cancelBtn = document.querySelector("#cancel-btn");
const categoriesList = document.querySelector(".categories-list");
const newCategoryBtn = document.querySelector("#new-category-btn");
const newCategoryForm = document.querySelector("#new-category-form");
const categorySelected = document.querySelector(".category-selected");
const allBtn = document.querySelector("#show-all");
const completedBtn = document.querySelector("#show-completed");
const uncompletedBtn = document.querySelector("#show-uncompleted");
const sortDropdown = document.querySelector("#sort-dropdown");

// Variabili globali
let editingTaskId = null;
let activeFilter = "uncompleted";
let activeSort;
const priorityOrder = { Bassa: 1, Media: 2, Alta: 3 };

// Init app
const saved = localStorage.getItem("app-state");
let store;
if (saved) {
  const savedData = JSON.parse(saved);
  const categoriesData = savedData.categories;
  const categories = categoriesData.map((c) => {
    const category = new Category(c.name);
    c.tasks.forEach((t) => {
      const task = new Task(
        t.title,
        t.desc,
        t.dueDate,
        t.priority,
        t.isCompleted
      );
      category.createTask(task);
    });
    return category;
  });
  store = new Store(categories);
  if (categories.length > 0) {
    store.selectCategory(categories[0].name);
    renderTasks(categories[0].name);
  }
  renderCategories();
} else {
  store = new Store([]);
  store.createCategory("Personale");
  store.selectCategory("Personale");
  renderCategories();
}

// Bottone per la modale + form submit listener del Nuovo task
newTaskBtn.addEventListener("click", () => {
  editingTaskId = null;
  document.querySelector("#form-submit").textContent = "Aggiungi";
  newTaskDialog.showModal();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#task-title").value;
  const desc = document.querySelector("#task-desc").value;
  const dueDate = document.querySelector("#task-date").value;
  const priority =
    document.querySelector("input[name='priority']:checked")?.value || "Media";

  if (editingTaskId) {
    store.getSelectedCategory().updateTask(editingTaskId, {
      title: title,
      desc: desc,
      dueDate: dueDate,
      priority: priority,
    });
    store.saveToLocalStorage();

    renderTasks(store.getSelectedCategory().name);
    newTaskDialog.close();
    editingTaskId = null;
    newTaskForm.reset();
  } else {
    store.getSelectedCategory().createTask({
      title: title,
      desc: desc,
      dueDate: dueDate,
      priority: priority,
      isCompleted: false,
    });
    store.saveToLocalStorage();
    renderTasks(store.getSelectedCategory().name);
    newTaskDialog.close();
    newTaskForm.reset();
  }
});

cancelBtn.addEventListener("click", () => newTaskDialog.close());

// Funzione per mostrare i tasks

function renderTasks(name) {
  taskList.innerHTML = "";

  const category = store.getCategories().find((cat) => cat.name === name);
  let tasksToShow = "";
  if (activeFilter === "all") {
    tasksToShow = category.getTasks();
  } else if (activeFilter === "completed") {
    tasksToShow = category.getCompletedTasks();
  } else {
    tasksToShow = category.getUncompletedTasks();
  }

  if (activeSort === "date-inc") {
    tasksToShow = tasksToShow.toSorted(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
  } else if (activeSort === "date-dec") {
    tasksToShow = tasksToShow.toSorted(
      (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
    );
  } else if (activeSort === "priority-inc") {
    tasksToShow = tasksToShow.toSorted(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  } else if (activeSort === "priority-dec") {
    tasksToShow = tasksToShow.toSorted(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }

  tasksToShow.forEach((t) => {
    let task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML = `<h2>${t.title}</h2>
      <p> ${t.desc} </p>
      <h3>${formatDate(t.dueDate)}</h3>
      <h4 class="priority-${t.priority.toLowerCase()}">${t.priority}</h4> 
      <label for='complete'>Completato</label>
      <label class="svg-checkbox">
      <input type="checkbox" id='complete' class="complete-checkbox" style="display:none" ${
        t.isCompleted ? "checked" : ""
      }>
        <span class="checkbox-icon unchecked">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </span>
      </label>
        <div class=task-actions>
        <button class='edit-btn'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#757575"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
        <button class='del-btn'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#757575"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z"/></svg></button>
        </div>`;
    taskList.appendChild(task);

    if (t.isCompleted) {
      task.classList.add("completed");
    }

    const checkbox = task.querySelector(".complete-checkbox");
    checkbox.addEventListener("change", () => {
      t.toggleCompleted();
      store.saveToLocalStorage();
      renderTasks(name);
    });

    const deleteBtn = task.querySelector(".del-btn");
    deleteBtn.addEventListener("click", () => {
      category.deleteTask(t.id);
      store.saveToLocalStorage();
      renderTasks(name);
    });

    const editBtn = task.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      const formSubmitBtn = document.querySelector("#form-submit");
      formSubmitBtn.textContent = "Modifica";
      editingTaskId = t.id;
      document.querySelector("#task-title").value = t.title;
      document.querySelector("#task-desc").value = t.desc;
      document.querySelector("#task-date").value = toInputDateFormat(t.dueDate);
      document.querySelector(
        `input[name='priority'][value='${t.priority}']`
      ).checked = true;
      newTaskDialog.showModal();
    });
  });
}

// Bottoni filtri
allBtn.addEventListener("click", () => {
  activeFilter = "all";
  uncompletedBtn.classList.remove("active");
  completedBtn.classList.remove("active");
  allBtn.classList.add("active");
  renderTasks(store.getSelectedCategory().name);
});
completedBtn.addEventListener("click", () => {
  activeFilter = "completed";
  allBtn.classList.remove("active");
  uncompletedBtn.classList.remove("active");
  completedBtn.classList.add("active");
  renderTasks(store.getSelectedCategory().name);
});
uncompletedBtn.addEventListener("click", () => {
  activeFilter = "uncompleted";
  allBtn.classList.remove("active");
  completedBtn.classList.remove("active");
  uncompletedBtn.classList.add("active");
  renderTasks(store.getSelectedCategory().name);
});
// Dropdown
sortDropdown.addEventListener("change", () => {
  if (sortDropdown.value === "date-inc") {
    activeSort = "date-inc";
  } else if (sortDropdown.value === "priority-inc") {
    activeSort = "priority-inc";
  } else if (sortDropdown.value === "date-dec") {
    activeSort = "date-dec";
  } else if (sortDropdown.value === "priority-dec") {
    activeSort = "priority-dec";
  } else {
    activeSort = null;
  }
  renderTasks(store.getSelectedCategory().name);
});

newCategoryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const catName = document.querySelector("#new-category").value;
  store.createCategory(catName);
  store.saveToLocalStorage();
  renderCategories();
  newCategoryForm.reset();
});

// Funzione per mostrare le categorie
function renderCategories() {
  categoriesList.innerHTML = "";
  store.getCategories().forEach((c) => {
    let cat = document.createElement("li");
    cat.innerHTML = `${c.name} 
    <svg class="del-cat-btn" xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 -960 960 960" width="24px" fill="#0e0d0dff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
    categoriesList.appendChild(cat);

    const delCatBtn = cat.querySelector(".del-cat-btn");
    delCatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      store.deleteCategory(c.name);
      store.saveToLocalStorage();
      renderCategories();
    });

    cat.addEventListener("click", () => {
      store.selectCategory(c.name);
      categorySelected.textContent = `${c.name}`;
      renderTasks(c.name);
    });
  });
}

// Funzione per formattare la data

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toInputDateFormat(date) {
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toISOString().slice(0, 10);
}
