export const RenderHandler = (function() {
  const render = (container, addBtn, list) => {
    container.innerHTML = list;
    container.prepend(addBtn);
  }
  const renderAllToDos = (container, addBtn, projectList) => {
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
  return { render, renderAllToDos }
})();
