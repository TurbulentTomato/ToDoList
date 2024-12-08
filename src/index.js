//initial plan : each project will have classifications
//called topic or list, user should be able to add new list/topic,
//in each topic/list, user can create to-Dos
//note: each topic/list will be an object having its title
//and an array containing its to-Dos
import { ProjectList, toDoCreator, UtilityHandler, RenderHandler } from "./barrelModule";
import "./reset.css";
import "./style.css";
(() => {
  let list = ProjectList.getList();
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
  const bindEvents = () => {
    addTaskBtn.addEventListener("click", () => { addTaskModal.showModal() })
    addProjectBtn.addEventListener("click", (event) => {
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
