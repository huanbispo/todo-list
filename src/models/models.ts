export interface Category {
  id?: string;
  name: string;
  todos: Todo[];
}

export interface Todo {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TodoStatus;
  categoryId: string;
}

export enum TodoStatus {
  Todo = 0,
  InProgress = 1,
  Completed = 2,
}

export interface FileAttachment {
  id: string;
  fileName: string;
  filePath: string;
  todoId: string;
}
