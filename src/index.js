//initial plan : each project will have classifications
//called topic or list, user should be able to add new list/topic,
//in each topic/list, user can create to-Dos
//note: each topic/list will be an object having its title
//and an array containing its to-Dos
import { ProjectList, UtilityHandler, DomHandler } from "./barrelModule";
import "./reset.css";
import "./style.css";
import "./modal.css";
import "./sidebar.css";
export let list = ProjectList.getList();
(() => {
  if (localStorage.getItem("projects")) {
    list.push(...JSON.parse(localStorage.getItem("projects")))
    list.forEach(project => { UtilityHandler.recoverMethods(project) })
    return;
  }
  ProjectList.addProject("Home"); //for some weird reason,this does not work when written without function and breaks the code
})()

DomHandler.bindEvents();
DomHandler.init();
