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
  let currentProject = null;
  let currentList = null;
  const projectTitleInput = addProjectModal.querySelector("#project-title")
  const bindEvents = () => {
    addTaskBtn.addEventListener("click", () => {
      taskProjectSelect.innerHTML = getProjectOption();
      taskListSelect.innerHTML = getListOption();
      addTaskModal.showModal()
    })
    addProjectBtn.addEventListener("click", (event) => {
      addProjectModal.showModal();
    })
    addListBtn.addEventListener("click", (event) => {
      listProjectSelect.innerHTML = getProjectOption();
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
      if (Array.from(event.target.classList).includes("del-project-btn")) {
        UtilityHandler.deleteObject(Number(event.target.closest("[data-index]")?.dataset.index), list);
        UtilityHandler.save();
        RenderHandler.renderProjectList(projectContainer, addProjectBtn, UtilityHandler.createProjectListDom());
      } else if (event.target.tagName.toLowerCase() === "button" && event.target.id !== "add-project-btn") {
        currentProject = list[Number(event.target.closest("[data-index]")?.dataset.index)];
        RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject))
      }
    })
    quickActionContainer.addEventListener("click", (event) => {
      if (Array.from(event.target.classList).includes("all")) {
        console.log("clicked haha")
        let innerHtml = ``;
        list.forEach(project => {
          for (const element of project.listCollection) {
            innerHtml += (UtilityHandler.createToDoListDom(element));
          }
          RenderHandler.renderList(toDoContainer, addTaskBtn, innerHtml)
        });
      }
    })
    submitListBtn.addEventListener("click", () => {
      currentProject = list[Number(listProjectSelect.value)];
      currentProject.addList(listTitleInput.value)
      UtilityHandler.save();
      RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
      addListModal.close();
    })
    listContainer.addEventListener("click", (event) => {
      if (Array.from(event.target.classList).includes("del-list-btn")) {
        UtilityHandler.deleteObject(Number(event.target.closest("[data-list-index]")?.dataset.listIndex), currentProject.listCollection);
        UtilityHandler.save();
        RenderHandler.renderProject(listContainer, addListBtn, UtilityHandler.createListCollectionDom(currentProject));
      } else if (event.target.tagName.toLowerCase() === "button" && event.target.id !== "add-list-btn") {
        console.log("rendering todos")
        currentList = currentProject.listCollection[Number(event.target.closest("[data-list-index]")?.dataset.listIndex)];
        RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createToDoListDom(currentList))
      }
    })
    submitTaskBtn.addEventListener("click", () => {
      currentProject = list[Number(taskProjectSelect.value)];
      currentList = currentProject.listCollection[Number(taskListSelect.value)]
      currentList.addToDo({
        title: taskTitleInput.value, description: taskDescriptionInput.value,
        dueDate: dueDateInput?.value, priority: priorityInput.value,
        hasBeenCompleted: taskStatusInput.checked
      })
      UtilityHandler.save();
      console.log(list)
      RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createToDoListDom(currentList))
      addTaskModal.close();
    })
    toDoContainer.addEventListener("click", (event) => {
      let toDo = currentList.toDos[Number(event.target.closest("[data-task-index]").dataset.taskIndex)];
      if (Array.from(event.target.classList).includes("del-task-btn")) {
        UtilityHandler.deleteObject(currentList.toDos.indexOf(toDo), currentList.toDos);
      } else if (event.target.tagName.toLowerCase() === "input") {
        toDo.hasBeenCompleted = !toDo.hasBeenCompleted;
      }
      RenderHandler.renderList(toDoContainer, addTaskBtn, UtilityHandler.createToDoListDom(currentList));
    })
  }
  const getProjectOption = () => {
    return list.map(project => project.title).reduce((options, optionTitle, index) => {
      //makes the currentProject as default selection in *ProjectSelect elements
      if (list.indexOf(currentProject) == index) {
        return options += `<option value="${index}" selected>${optionTitle}</option>`;
      }
      return options += `<option value="${index}">${optionTitle}</option>`;
    }, ``)
  }
  const getListOption = () => {
    return currentProject.listCollection.map(list => list.title).reduce((options, optionTitle, index) => {
      return options += `<option value="${index}">${optionTitle}</option>`;
    }, ``)
  }
  return { bindEvents }
})();
DomHandler.bindEvents();
//attaching functions and other things to window
//so i can use them in dev-tools console
window.ProjectList = ProjectList;
window.toDoCreator = toDoCreator
window.UtilityHandler = UtilityHandler
window.RenderHandler = RenderHandler
