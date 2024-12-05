export function toDoCreator(info = {}) {
  let { title, description, dueDate, priority, hasBeenCompleted } = info;
  return { title, description, dueDate, priority, hasBeenCompleted }
}
