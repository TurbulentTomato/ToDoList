//initial plan : each project will have classifications
//called topic or list, user should be able to add new list/topic,
//in each topic/list, user can create to-Dos
//note: each topic/list will be an object having its title
//and an array containing its to-Dos
import { ProjectList, toDoCreator, UtilityHandler, RenderHandler } from "./barrelModule";
import "./reset.css";
import "./style.css";
import "./modal.css";
import "./sidebar.css";
let list = ProjectList.getList();
(() => {
  if (localStorage.getItem("projects")) {
    list.push(...JSON.parse(localStorage.getItem("projects")))
    list.forEach(project => { UtilityHandler.recoverMethods(project) })
    return
  }
  ProjectList.addProject("Home"); //for some weird reason,this does not work when written without function and breaks the code
})()

const DomHandler = (function() {
  const sidebar = document.querySelector("#sidebar");
  const quickActionContainer = document.querySelector(".quick-actions");
  const projectContainer = document.querySelector(".project-list");
  const listContainer = document.querySelector("#list-container");
  const toDoContainer = document.querySelector("main");
  const addTaskBtn = document.querySelector("#add-task-btn");
  const addListBtn = document.querySelector("#add-list-btn");
  const addProjectBtn = document.querySelector("#add-project-btn");
  const cancelBtn = document.querySelectorAll(".cancel-btn");
  const addProjectModal = document.querySelector(".add-project-modal");
  const addListModal = document.querySelector(".add-list-modal");
  const addTaskModal = document.querySelector(".add-task-modal");
  const submitProjectButton = addProjectModal.querySelector(".submit-btn");
  const listProjectSelect = document.querySelector("#list-project-select");
  const taskProjectSelect = document.querySelector("#task-project-select");
  const taskListSelect = document.querySelector("#task-list-select");
  const listTitleInput = document.querySelector("#list-title");
  const submitListBtn = addListModal.querySelector(".submit-btn");
  const submitTaskBtn = addTaskModal.querySelector(".submit-btn");
  const taskTitleInput = document.querySelector("#task-title");
  const taskDescriptionInput = document.querySelector("#description");
  const dueDateInput = document.querySelector("#due-date");
  const priorityInput = document.querySelector("#priority");
  const taskStatusInput = document.querySelector("#has-been-completed");
  const isTaskImprtant = document.querySelector("#is-important");
  let currentProject = null;
  let currentList = null;
  let quickAction = null;
  let isEditing = false;
  let currentTask = null;
  const projectTitleInput = addProjectModal.querySelector("#project-title");
  const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
  const toggleSidebarImg = toggleSidebarBtn.querySelector("img");
  const cancelTaskBtn = document.querySelector(".add-task-modal .cancel-btn");
  let tempCurrentProject = null;
  let tempCurrentList = null;
  let domProject = null; //holds the li which refers to current project
  let domList = null; //like domProject but for currentList
  const asideHeading = document.querySelector("aside h1");
  const bindEvents = () => {
    addTaskBtn.addEventListener("click", () => {
      if (currentProject === null || currentProject.listCollection.length === 0) {
        for (const project of list) {
          if (project.listCollection.length > 0) {
            currentProject = project;
            break;
          }
        }
        currentList = currentProject.listCollection[0];
        RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
      }
      tempCurrentProject = currentProject;
      tempCurrentList = currentList;
      taskProjectSelect.innerHTML = getProjectOption();
      taskListSelect.innerHTML = getListOption();
      isEditing = false;
      toggleSelectElements();
      addTaskModal.showModal()
    })
    addProjectBtn.addEventListener("click", (event) => {
      addProjectModal.showModal();
    })
    addListBtn.addEventListener("click", (event) => {
      listProjectSelect.innerHTML = getProjectOption(false);
      addListModal.showModal();
    })
    cancelBtn.forEach(button => {
      button.addEventListener("click", () => {
        addProjectModal.close();
        addListModal.close();
        addTaskModal.close();
      })
    })
    submitProjectButton.addEventListener("click", () => {
      ProjectList.addProject(projectTitleInput.value);
      UtilityHandler.save();
      RenderHandler.renderProjectList(projectContainer, addProjectBtn, UtilityHandler.createProjectListDom());
      addProjectModal.close();
    })
    projectContainer.addEventListener("click", (event) => {
      if (event.target.id === "add-project-btn" || event.target.parentNode.id === "add-project-btn") return
      let li = event.target.closest("[data-index]")
      if (Array.from(event.target.classList).includes("del-project-btn")) {
        UtilityHandler.deleteObject(Number(li?.dataset.index), list);
        UtilityHandler.save();
        RenderHandler.renderProjectList(projectContainer, addProjectBtn, UtilityHandler.createProjectListDom());
      } else if (event.target.tagName.toLowerCase() === "button" || event.target.tagName.toLowerCase() === "span") {
        quickAction = null;
        updateCurrentProject(list[Number(li?.dataset.index)], li);
        RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
        toDoContainer.innerHTML = "";
        if (currentProject.listCollection.length < 1) return;
        updateCurrentList(currentProject.listCollection[0], document.querySelector(`li[data-list-index="0"]`));
        renderToDos();
      }
    })
    //renderToDos can be used below
    quickActionContainer.addEventListener("click", (event) => {
      let classList = Array.from(event.target.classList)
      if (classList.includes("all")) {
        quickAction = "all";
      } else if (classList.includes("pending")) {
        quickAction = "pending";
      } else if (classList.includes("completed")) {
        quickAction = "completed";
      } else if (classList.includes("important")) {
        quickAction = "important";
      }
      if (quickAction) {
        listContainer.innerHTML = "";
        updateCurrentProject(null, sidebar.querySelector(`li.${quickAction}`));
        renderToDos();
      }
    })
    submitListBtn.addEventListener("click", () => {
      currentProject = list[Number(listProjectSelect.value)];
      currentProject.addList(listTitleInput.value)
      UtilityHandler.save();
      RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
      let listIndex = currentProject.listCollection.length - 1;
      updateCurrentProject(currentProject, sidebar.querySelector(`li[data-index="${list.indexOf(currentProject)}"]`));
      updateCurrentList(currentProject.listCollection[listIndex], document.querySelector(`li[data-list-index="${listIndex}"]`));
      renderToDos();
      addListModal.close();
    })
    listContainer.addEventListener("click", (event) => {
      if (event.target === addListBtn) return;
      let li = event.target.closest("[data-list-index]");
      if (Array.from(event.target.classList).includes("del-list-btn")) {
        UtilityHandler.deleteObject(Number(li?.dataset.listIndex), currentProject.listCollection);
        UtilityHandler.save();
        RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
        if (currentProject.listCollection.length !== 0) {
          let listIndex = Number(li?.dataset.listIndex) - 1;
          updateCurrentList(currentProject.listCollection[listIndex], document.querySelector(`li[data-list-index="${listIndex}"]`));
        } else {
          toDoContainer.innerHTML = "";
          return;
        }
      } else if (event.target.tagName.toLowerCase() === "button") {
        console.log("rendering todos")
        updateCurrentList(currentProject.listCollection[Number(li?.dataset.listIndex)], li);
      }
      renderToDos();
    })
    submitTaskBtn.addEventListener("click", () => {
      if (isEditing) {
        UtilityHandler.edit(currentTask, createToDoFromInput());
      } else {
        quickAction = null;
        updateCurrentProject(list[Number(taskProjectSelect.value)], document.querySelector(`[data-index="${taskProjectSelect.value}"]`));
        updateCurrentList(currentProject.listCollection[Number(taskListSelect.value)], document.querySelector(`li[data-list-index="${taskListSelect.value}"]`));
        currentList.addToDo(createToDoFromInput());
      }
      UtilityHandler.save();
      console.log(list)
      renderToDos();
      addTaskModal.close();
    })
    toDoContainer.addEventListener("click", (event) => {
      let classList = Array.from(event.target.classList);
      if (event.target === addTaskBtn) return
      let article = event.target.closest("[data-task-index]");
      currentProject = list[Number(article.dataset.projectIndex)];
      currentList = currentProject.listCollection[Number(article?.dataset.listIndex)];
      currentTask = currentList.toDos[Number(article?.dataset.taskIndex)];
      if (classList.includes("del-task-btn")) {
        UtilityHandler.deleteObject(currentList.toDos.indexOf(currentTask), currentList.toDos);
        renderToDos();
      } else if (classList.includes("toggle-has-been-completed")) {
        currentTask.hasBeenCompleted = !currentTask.hasBeenCompleted;
        event.target.parentNode.innerHTML = `<input type="checkbox" class="toggle-has-been-completed" ${currentTask.hasBeenCompleted ? "checked" : ""}> ${currentTask.hasBeenCompleted ? "Completed" : "Pending"}`
        let shift = currentTask.hasBeenCompleted ? "push" : "unshift";
        UtilityHandler.shiftEle(currentTask, currentList.toDos, shift);
        renderToDos();
      } else if (classList.includes("edit-task-btn")) {
        populateTaskModal(); //popukates the modal with currentTask's info
        isEditing = true;
        toggleSelectElements(); //disables the select elements
        addTaskModal.showModal();
      } else if (classList.includes("toggle-is-important")) {
        currentTask.isImportant = !currentTask.isImportant;
        event.target.parentNode.innerHTML = `<input type="checkbox" class="toggle-is-important" ${currentTask.isImportant ? "checked" : ""}> Important`
      }
      UtilityHandler.save();
    })
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
      toggleSidebarBtn.classList.toggle("close");
      toggleSidebarImg.classList.toggle("close");
    })
    taskProjectSelect.addEventListener("change", () => {
      currentProject = list[Number(taskProjectSelect.value)];
      taskListSelect.innerHTML = getListOption();
      RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
    })
    cancelTaskBtn.addEventListener("click", () => {
      if (isEditing) return;
      if (quickAction) {
        listContainer.innerHTML = "";
        return;
      }
      updateCurrentProject(tempCurrentProject, domProject);
      RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
      updateCurrentList(tempCurrentList, document.querySelector(`li[data-list-index="${currentProject.listCollection.indexOf(tempCurrentList)}"]`));
    })
  }
  const getProjectOption = (forTask = true) => {
    return list.reduce((options, project, index) => {
      //makes the currentProject as default selection in *ProjectSelect elements
      if (project.listCollection.length < 1 && forTask) {
        return options += ``;
      }
      if (list.indexOf(currentProject) == index) {
        return options += `<option value="${index}" selected>${project.title}</option>`;
      }
      return options += `<option value="${index}">${project.title}</option>`;
    }, ``)
  }
  const getListOption = () => {
    return currentProject.listCollection.map(list => list.title).reduce((options, optionTitle, index) => {
      //makes the currentList as default selection in *taskListSelect element
      if (currentProject.listCollection.indexOf(currentList) === index) {
        return options += `<option value="${index}" selected>${optionTitle}</option>`;
      }
      return options += `<option value="${index}">${optionTitle}</option>`;
    }, ``)
  }
  const renderToDos = () => {
    if (quickAction != null) {
      if (quickAction === "all") {
        RenderHandler.renderAllToDos(toDoContainer, addTaskBtn, list);
      } else if (quickAction === "important") {
        RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createFilteredToDoList("isImportant", true));
      } else {
        RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createFilteredToDoList("hasBeenCompleted", quickAction === "completed"));
      }
      asideHeading.textContent = quickAction.slice(0, 1).toUpperCase().concat(quickAction.slice(1)) + " Tasks";
    } else {
      RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createToDoListDom(currentProject, currentList));
    }
  }
  const toggleSelectElements = () => {
    // disables or enables the select element based on the situation
    if (isEditing) {
      taskProjectSelect.setAttribute("disabled", "disabled");
      taskListSelect.setAttribute("disabled", "disabled");
      return;
    }
    taskProjectSelect.removeAttribute("disabled");
    taskListSelect.removeAttribute("disabled");
  }
  const populateTaskModal = () => {
    taskTitleInput.value = currentTask.title;
    taskDescriptionInput.value = currentTask.description;
    dueDateInput.value = currentTask.dueDate;
    priorityInput.value = currentTask.priority;
    taskStatusInput.checked = currentTask.hasBeenCompleted;
    taskProjectSelect.innerHTML = getProjectOption();
    taskListSelect.innerHTML = getListOption();
  }
  const createToDoFromInput = () => {
    return {
      title: taskTitleInput.value, description: taskDescriptionInput.value,
      dueDate: dueDateInput?.value, priority: priorityInput.value,
      hasBeenCompleted: taskStatusInput.checked, isImportant: isTaskImprtant.checked
    }
  }
  const updateCurrentList = (list, domReference) => {
    domList?.classList.remove("current-list");
    currentList = list;
    domList = domReference;
    domList?.classList.add("current-list");
    asideHeading.textContent = `${currentProject.title}: ${currentList.title}`;
  }
  const updateCurrentProject = (project, domReference) => {
    domProject?.classList.toggle("current-project");
    currentProject = project;
    domProject = domReference;
    domProject?.classList.toggle("current-project");
    asideHeading.textContent = currentProject?.title;
  }
  const getDomList = () => {
    return document.querySelector(`li[data-list-index="${currentProject.listCollection.indexOf(currentList)}"]`)
  }
  const init = () => {
    if (list.length < 1) return;
    RenderHandler.renderProjectList(projectContainer, addProjectBtn, UtilityHandler.createProjectListDom());
    updateCurrentProject(list[0], document.querySelector(`[data-index="0"]`));
    if (currentProject.listCollection.length < 1) return;
    RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject))
    updateCurrentList(currentProject.listCollection[0], document.querySelector(`li[data-list-index="0"]`));
    renderToDos();
  }
  return { bindEvents, init }
})();
DomHandler.bindEvents();
DomHandler.init();
//attaching functions and other things to window
//so i can use them in dev-tools console
window.ProjectList = ProjectList;
window.toDoCreator = toDoCreator
window.UtilityHandler = UtilityHandler
window.RenderHandler = RenderHandler
