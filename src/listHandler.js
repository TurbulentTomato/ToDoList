import { toDoCreator } from "./barrelModule.js";
export function listCreator(title) {
  let toDos = []
  const addToDo = (info) => {
    toDos.push(toDoCreator(info));
  }
  return { title, toDos, addToDo };
}
