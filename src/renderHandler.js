export const RenderHandler = (function() {
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
    renderToDos(list);
  }
  const renderToDos = (list, renderAll = false) => {
    for (let toDo of list.toDos) {
      output += `${toDo.title}
Description: ${toDo.description}
Due-Date: ${toDo.dueDate}
Priority: ${toDo.priority}
Status: ${toDo.hasBeenCompleted ? "Completed" : "Pending"}\n
`;
    }
    if (!renderAll) {
      console.log(output);
    }
  }
  const renderAllToDos = () => {
    let projects = ProjectList.getList();
    for (const project of projects) {
      project.listCollection.forEach(list => {
        renderToDos(list, true);
      });
    }
    console.log(output);
  }
  return { renderProjectList, renderProject, renderList, renderAllToDos }
})();
