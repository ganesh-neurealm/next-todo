'use server';

import type { Todo } from '@/app/types/todo';
import { revalidatePath } from 'next/cache';

const url = process.env.NEXT_PUBLIC_API_URL;
export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${url}/todos/`);
  const data = await res.json();
  return data.map((todo: Todo) => ({ id: todo.id.toString(), title: todo.title }));
}

export async function addTodo(_: unknown, formData: FormData): Promise<{ message: string }> {
  try {
    const title = formData.get('title') as string;

    await fetch(`${url}/todos/`, {
      method: 'POST',
      body: JSON.stringify({ title}),
      headers: { 'Content-Type': 'application/json' },
    });
    return { message: 'Created' };
  } catch (error: unknown) {
    return { message: error.message || 'Failed to create todo' };
  }
}


export async function updateTodo(_: unknown, formData: FormData): Promise<{ message: string }> {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  await fetch(`${url}/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' },
  });
  return { message: 'Updated' };
}

export async function deleteTodo(id: number|string): Promise<{ message: string }> {
 await fetch(`${url}/todos/${id}`, {
    method: 'DELETE',
  });
  return { message: 'Deleted' };
}
