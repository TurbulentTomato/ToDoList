//initial plan : each project will have classifications
//called topic or list, user should be able to add new list/topic,
//in each topic/list, user can create to-Dos
//note: each topic/list will be an object having its title
//and an array containing its to-Dos
import { ProjectList, toDoCreator, UtilityHandler, RenderHandler } from "./barrelModule";
import "./reset.css";
import "./style.css";
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
  const projectContainer = document.querySelector(".project-list");
  const listContainer = document.querySelector("#list-container");
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
  let currentProject = null;
  const projectTitleInput = addProjectModal.querySelector("#project-title")
  const bindEvents = () => {
    addTaskBtn.addEventListener("click", () => {
      taskProjectSelect.innerHTML = getProjectOption();
      taskListSelect.innerHTML = getListOption();
      addTaskModal.showModal()
    })
    addProjectBtn.addEventListener("click", (event) => {
      listProjectSelect.innerHTML = getProjectOption();
      addProjectModal.showModal();
    })
    addListBtn.addEventListener("click", (event) => {
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
      }
    })
  }
  const getProjectOption = () => {
    return list.map(project => project.title).reduce((options, optionTitle, index) => {
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
