export interface Todo {
    id: string;
    title: string;
  }
  export type TodoStore = {
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
  };
  