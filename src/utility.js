import { ProjectList, listCreator } from "./barrelModule";
export const UtilityHandler = (function() {
  const deleteObject = (objectIndex, array) => {
    array.splice(objectIndex, 1);
  }
  //will help to edit/update the values of properties
  const edit = (object, newInfo) => {
    for (const info in newInfo) {
      if (info in object) {
        object[info] = newInfo[info]
      }
    }
  }
  const recoverMethods = (project) => {
    project.addList = (listTitle) => {
      project.listCollection.push(listCreator(listTitle))
    };
    project.listCollection.forEach(list => {
      list.addToDo = (info) => {
        list.toDos.push(toDoCreator(info));
      }
    })
  }
  const save = () => {
    localStorage.setItem("projects", JSON.stringify(ProjectList.getList()))
  }
  const createProjectListDom = () => {
    let list = ProjectList.getList().map(project => project.title);
    return list.reduce((innerHtml, projectTitle, index) => {
      return innerHtml += `<li data-index="${index}">
<button type="button">${projectTitle}</button>
<button type="button" class="del-project-btn">×</button>
</li>`
    }, ``)
  }
  //creates a collection of lists present in an object which can be rendered to dom
  const createListCollectionDom = (project) => {
    let list = project.listCollection.map(list => list.title);
    return list.reduce((innerHtml, listTitle, index) => {
      return innerHtml += `<li data-list-index="${index}">
<button type="button">${listTitle}</button>
<button type="button" class="del-list-btn">×</button>
</li>`
    }, ``)
  }
  const createToDoListDom = (project, list) => {
    let projectIndex = ProjectList.getList().indexOf(project)
    let listIndex = project.listCollection.indexOf(list);
    let toDoList = list.toDos.map((toDo, index) => {
      return `<article data-task-index="${index}" data-list-index="${listIndex}" data-project-index="${projectIndex}">
<h4>${toDo.title}</h4>
<p>${toDo.description}</p>
<p>Due-Date: ${toDo.dueDate}</p>
<p>Priority: ${toDo.priority}</p>
<label><input type="checkbox" ${toDo.hasBeenCompleted ? "checked" : ""}> ${toDo.hasBeenCompleted ? "Completed" : "Pending"}</label>
<button type="button" class="del-task-btn">×</button>
</article>
`
    })
    return toDoList.join("")
  }
  return { deleteObject, edit, save, recoverMethods, createProjectListDom, createListCollectionDom, createToDoListDom }
})();
