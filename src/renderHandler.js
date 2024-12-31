export const RenderHandler = (function() {
  //will currently log to console
  let output = "";
  const render = (container, addBtn, list) => {
    container.innerHTML = list;
    container.prepend(addBtn);
  }
  const renderToDos = (container, list) => {
    /*  for (let toDo of list.toDos) {
        output += `${toDo.title}
  Description: ${toDo.description}
  Due-Date: ${toDo.dueDate}
  Priority: ${toDo.priority}
  Status: ${toDo.hasBeenCompleted ? "Completed" : "Pending"}\n
  `;
      }
      if (!renderAll) {
        console.log(output);
      }*/
  }
  const renderAllToDos = (container, addBtn, projectList) => {
    /*let projects = ProjectList.getList();
    for (const project of projects) {
      project.listCollection.forEach(list => {
        renderToDos(list, true);
      });
    }
    console.log(output);*/
    let innerHtml = ``;
    let renderingImportant = true;
    do {
      projectList.forEach(project => {
        for (const element of project.listCollection) {
          innerHtml += UtilityHandler.createArticles({
            projectIndex: projectList.indexOf(project),
            listIndex: project.listCollection.indexOf(element),
            list: element
          }, renderingImportant);
        }
        render(container, addBtn, innerHtml)
      });
      renderingImportant = renderingImportant ? false : null;
    } while (renderingImportant != null)
  }
  return { render, renderToDos, renderAllToDos }
})();
