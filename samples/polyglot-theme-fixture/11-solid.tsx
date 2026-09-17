import { createSignal, For } from "solid-js";

export function TodoList() {
  const [todos, setTodos] = createSignal(["Read", "Ship"]);
  return <For each={todos()}>{(todo) => <li onClick={() => setTodos(todos().filter((item) => item !== todo))}>{todo}</li>}</For>;
}
