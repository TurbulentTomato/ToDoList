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
  return { title, list: [{ title: "default", toDos: [] }] };
}
//attaching functions and other things to window
//so i can use them in dev-tools console
window.ProjectList = ProjectList;
