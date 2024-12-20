export function toDoCreator(info = {}) {
  let { title, description, dueDate, priority, hasBeenCompleted, isImportant } = info;
  return { title, description, dueDate, priority, hasBeenCompleted, isImportant }
}
