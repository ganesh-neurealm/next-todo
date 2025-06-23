import { create } from 'zustand';
import type { TodoStore } from '@/app/types/todo';

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos })
}));
