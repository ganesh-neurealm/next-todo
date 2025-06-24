import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TodoStore } from '@/app/types/todo';

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      setTodos: (todos) => set({ todos }),
    }),
    {
      name: 'todo-store', 
    }
  )
);
