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

// Init app
const store = new Store([]);
store.createCategory("Personale");
store.selectCategory("Personale");
renderCategories();

// Variabili globali
let editingTaskId = null;
let activeFilter = "all";
let activeSort;
const priorityOrder = { Bassa: 1, Media: 2, Alta: 3 };

// Bottone per la modale + form submit listener del Nuovo task
newTaskBtn.addEventListener("click", () => {
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
    renderTasks(store.getSelectedCategory().name);
    newTaskDialog.close();
    editingTaskId = null;
  } else {
    store.getSelectedCategory().createTask({
      title: title,
      desc: desc,
      dueDate: dueDate,
      priority: priority,
      isCompleted: false,
    });
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
      <h3>${t.dueDate}</h3>
      <h4>${t.priority}</h4> 
      <label for='complete'>Completato</label>
      <input type="checkbox" id='complete' class="complete-checkbox" ${
        t.isCompleted ? "checked" : ""
      }>
        <button class='edit-btn'>Modifica</button>
        <button class='del-btn'>Elimina</button>`;
    taskList.appendChild(task);

    if (t.isCompleted) {
      task.classList.add("completed");
    }

    const checkbox = task.querySelector(".complete-checkbox");
    checkbox.addEventListener("change", () => {
      t.toggleCompleted();
      renderTasks(name);
    });

    const deleteBtn = task.querySelector(".del-btn");
    deleteBtn.addEventListener("click", () => {
      category.deleteTask(t.id);
      renderTasks(name);
    });

    const editBtn = task.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      const formSubmitBtn = document.querySelector("#form-submit");
      formSubmitBtn.textContent = "Modifica";
      editingTaskId = t.id;
      document.querySelector("#task-title").value = t.title;
      document.querySelector("#task-desc").value = t.desc;
      document.querySelector("#task-date").value = t.dueDate;
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
  renderTasks(store.getSelectedCategory().name);
});
completedBtn.addEventListener("click", () => {
  activeFilter = "completed";
  renderTasks(store.getSelectedCategory().name);
});
uncompletedBtn.addEventListener("click", () => {
  activeFilter = "uncompleted";
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
  renderCategories();
});

// Funzione per mostrare le categorie
function renderCategories() {
  categoriesList.innerHTML = "";
  store.getCategories().forEach((c) => {
    let cat = document.createElement("li");
    cat.textContent = `${c.name}`;
    categoriesList.appendChild(cat);

    cat.addEventListener("click", () => {
      store.selectCategory(c.name);
      categorySelected.textContent = `${c.name}`;
      renderTasks(c.name);
    });
  });
}

// const task = new Task('Titolo di test', 'Descrizione di test', '2025-09-12', 'High', false);
// const personale = store.getCategories().find((cat) => cat.name === 'Personale')
// personale.createTask(task)
// renderTasks('Personale')
