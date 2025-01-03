import { ProjectList, listCreator, toDoCreator } from "./barrelModule";
import editIcon from "./images/edit-svgrepo-com.svg";
import { format } from "date-fns";
export const UtilityHandler = (function() {
  const priorities = ["high", "medium", "low"];
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
<button type="button"><span>#</span>${projectTitle}</button>
<button type="button" class="del-project-btn">×</button>
</li>`
    }, ``)
  }
  const shiftEle = (ele, arr, shift) => {
    arr[shift](...arr.splice(arr.indexOf(ele), 1));
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
    let projectIndex = ProjectList.getList().indexOf(project);
    let listIndex = project.listCollection.indexOf(list);
    let toDoList = createArticles({ projectIndex, listIndex, list }, true);
    toDoList += createArticles({ projectIndex, listIndex, list }, false);
    return toDoList;
  }
  const createFilteredToDoList = (property, value) => {
    let renderingImportant = true;
    let projectList = ProjectList.getList();
    let filteredDomList = ``;
    do {
      for (const project of projectList) {
        for (let list of project.listCollection) {
          let tempToDos = list.toDos.map(toDo => {
            return (toDo[property] === value) ? toDo : null;
          });
          [tempToDos, list.toDos] = [list.toDos, tempToDos];
          filteredDomList += createArticles({
            projectIndex: projectList.indexOf(project),
            listIndex: project.listCollection.indexOf(list),
            list
          }, renderingImportant);
          list.toDos = tempToDos;
        }
      } renderingImportant = renderingImportant ? false : null;
    } while (renderingImportant !== null)
    return filteredDomList;
  }
  const createArticles = (data, onlyForImportant = true) => {
    let { projectIndex, listIndex, list } = data;
    let toDoList = ``;
    list.toDos.forEach((toDo, index) => {
      if (toDo === null || toDo.isImportant !== onlyForImportant) {
        return;
      }
      toDoList += `<article class="p-${priorities[toDo.priority]} ${toDo.hasBeenCompleted ? "completed" : ""}" data-task-index="${index}" data-list-index="${listIndex}" data-project-index="${projectIndex}">
<h4>${toDo.title}</h4>
<p class="description">${toDo.description}</p>
<hr>
<p>Due-Date: ${format(new Date(toDo.dueDate), "do MMM yyyy")}</p>
<p>Priority: ${priorities[toDo.priority].toUpperCase()}</p>
<hr>
<label><input type="checkbox" class="toggle-has-been-completed" ${toDo.hasBeenCompleted ? "checked" : ""}> ${toDo.hasBeenCompleted ? "Completed" : "Pending"}</label>
<label><input type="checkbox" class="toggle-is-important"${toDo.isImportant ? "checked" : ""}> Important</label>
<button type="button" class="del-task-btn">×</button>
<button type="button" class="edit-task-btn">
<img src="${editIcon}" alt="edit task button" class="edit-task-btn">
</button>
</article>`
    })
    return toDoList;
  }
  return { deleteObject, edit, save, recoverMethods, createProjectListDom, createListCollectionDom, createToDoListDom, createFilteredToDoList, createArticles, shiftEle }
})();
