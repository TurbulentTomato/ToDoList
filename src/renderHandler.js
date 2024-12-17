export const RenderHandler = (function() {
  //will currently log to console
  let output = "";
  const renderProjectList = (container, addBtn, list) => {
    //output = `Available projects:${ProjectList.getList().map(project => " " + project.title)}`;
    // console.log(output);
    container.innerHTML = list;
    container.prepend(addBtn);
  }
  const renderProject = (container, addBtn, list) => {
    /*  output = `
  Project: ${project.title}
  Available Lists:${project.listCollection.map(list => { return " " + list.title })}
  `;
      console.log(output);*/
    container.innerHTML = list;
    container.prepend(addBtn);
  }
  const renderList = (container, addBtn, list) => {
    /* output = `List: ${list.title}\n\n`;
     renderToDos(list);*/
    container.innerHTML = list;
    container.prepend(addBtn)
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
    projectList.forEach(project => {
      for (const element of project.listCollection) {
        innerHtml += (UtilityHandler.createToDoListDom(project, element));
      }
      renderList(container, addBtn, innerHtml)
    });
  }
  return { renderProjectList, renderProject, renderList, renderToDos, renderAllToDos }
})();
