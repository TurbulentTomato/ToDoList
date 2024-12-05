import { listCreator } from "./barrelModule.js";
export const ProjectList = (function() {
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

export function projectCreator(title) {
  let listCollection = [listCreator("default")];
  const addList = (listTitle) => {
    listCollection.push(listCreator(listTitle));
  }
  return { title, listCollection, addList };
}
