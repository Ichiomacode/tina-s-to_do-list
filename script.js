// Initial References
const userInput = document.querySelector("#new-task input");
const taskContainer = document.querySelector("#tasks");
let deleteButtons, editButtons, taskElements;
let selectedTaskId = "";
let taskCounter;

// Function on window load
window.onload = () => {
  selectedTaskId = "";
  taskCounter = Object.keys(localStorage).length;
  displayTaskList();
};

// Function to Display The Tasks
const displayTaskList = () => {
  if (Object.keys(localStorage).length > 0) {
    taskContainer.style.display = "inline-block";
  } else {
    taskContainer.style.display = "none";
  }

  // Clear the tasks
  taskContainer.innerHTML = "";

  // Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("data-task-id", key);
    taskInnerDiv.innerHTML = `<span class="task-name">${
      key.split("_")[1]
    }</span>`;
    // Local storage would store boolean as a string, so we parse it to boolean back
    let editButton = document.createElement("button");
    editButton.classList.add("edit-task");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete-task"><i class="fa-solid fa-trash"></i></button>`;
    taskContainer.appendChild(taskInnerDiv);
  }

  // Tasks completed
  taskElements = document.querySelectorAll(".task");
  taskElements.forEach((element, index) => {
    element.onclick = () => {
      // Local storage update
      if (element.classList.contains("completed")) {
        updateTaskStatus(
          element.getAttribute("data-task-id").split("_")[0],
          element.innerText,
          false
        );
      } else {
        updateTaskStatus(
          element.getAttribute("data-task-id").split("_")[0],
          element.innerText,
          true
        );
      }
    };
  });

  // Edit Tasks
  editButtons = document.getElementsByClassName("edit-task");
  Array.from(editButtons).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      // Stop propagation to outer elements (if removed when we click delete eventually the click will move to parent)
      e.stopPropagation();
      // Disable other edit buttons when one task is being edited
      disableEditButtons(true);
      // Update input value and remove div
      let parent = element.parentElement;
      userInput.value = parent.querySelector(".task-name").innerText;
      // Set selectedTaskId to the task that is being edited
      selectedTaskId = parent.getAttribute("data-task-id");
      // Remove task
      parent.remove();
    });
  });

  // Delete Tasks
  deleteButtons = document.getElementsByClassName("delete-task");
  Array.from(deleteButtons).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Delete from local storage and remove div
      let parent = element.parentElement;
      removeTaskFromStorage(parent.getAttribute("data-task-id"));
      parent.remove();
      taskCounter -= 1;
    });
  });
};

// Disable Edit Buttons
const disableEditButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit-task");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Remove Task from local storage
const removeTaskFromStorage = (taskId) => {
  localStorage.removeItem(taskId);
  displayTaskList();
};

// Add tasks to local storage
const updateTaskStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTaskList();
};

// Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  // Enable the edit button
  disableEditButtons(false);
  if (userInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    // Store locally and display from local storage
    if (selectedTaskId == "") {
      // New task
      updateTaskStorage(taskCounter, userInput.value, false);
    } else {
      // Update task
      let existingCount = selectedTaskId.split("_")[0];
      removeTaskFromStorage(selectedTaskId);
      updateTaskStorage(existingCount, userInput.value, false);
      selectedTaskId = "";
    }
    taskCounter += 1;
    userInput.value = "";
  }
});
