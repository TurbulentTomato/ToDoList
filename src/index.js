//initial plan : each project will have classifications
//called topic or list, user should be able to add new list/topic,
//in each topic/list, user can create to-Dos
//note: each topic/list will be an object having its title
//and an array containing its to-Dos
const ProjectList = (function() {
  let projects = [];
  const addProject = (title) => {
    //creates and pushes a Prpject object that contains
    //title of project and an array to store its topics/lists
    projects.push(projectCreator(title));
  }
  const getList = () => {
    console.log(projects);
    return projects;
  }
  return { addProject, getList };
})();

function projectCreator(title) {
  let listCollection = [listCreator("default")];
  const addList = (listTitle) => {
    listCollection.push(listCreator(listTitle));
  }
  return { title, listCollection, addList };
}

function listCreator(title) {
  let toDos = []
  const addToDo = (info) => {
    toDos.push(toDoCreator(info));
  }
  return { title, toDos, addToDo };
}

function toDoCreator(info = {}) {
  let { title, description, dueDate, priority, hasBeenCompleted } = info;
  return { title, description, dueDate, priority, hasBeenCompleted }
}

RenderHandler = (function() {
  //will currently log to console
  let output = "";
  const renderProjectList = () => {
    output = `Available projects:${ProjectList.getList().map(project => " " + project.title)}`;
    console.log(output);
  }
  const renderProject = (project) => {
    output = `
Project: ${project.title}
Available Lists:${project.listCollection.map(list => { return " " + list.title })}
`;
    console.log(output);
  }
  const renderList = (list) => {
    output = `List: ${list.title}\n\n`;
    for (let toDo of list.toDos) {
      output += `${toDo.title}
Description: ${toDo.description}
Due-Date: ${toDo.dueDate}
Priority: ${toDo.priority}
Status: ${hasBeenCompleted ? "Completed" : "Pending"}\n
`;
    }
    console.log(output)
  }
  return { renderProjectList, renderProject, renderList }
})();
//attaching functions and other things to window
//so i can use them in dev-tools console
window.ProjectList = ProjectList;
window.toDoCreator = toDoCreator
