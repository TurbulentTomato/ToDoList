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
  let list = [listCreator("default")];
  const addList = (listTitle) => {
    list.push(listCreator(listTitle));
  }
  return { title, list, addList };
}

function listCreator(title) {
  toDos = []
  const addToDo = (info) => {
    toDos.push(toDoCreator(info));
  }
  return { title, toDos, addToDo };
}

function toDoCreator(info = {}) {
  let { title, description, dueDate, priority } = info;
  return { title, description, dueDate, priority }
}
//attaching functions and other things to window
//so i can use them in dev-tools console
window.ProjectList = ProjectList;
window.toDoCreator = toDoCreator
