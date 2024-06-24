import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Category, FileAttachment, Todo, TodoStatus } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl = 'https://localhost:7202';
  private categoriesUpdated = new Subject<Category[]>();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getTodos(categoryId: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(
      `${this.baseUrl}/categories/${categoryId}/todos`
    );
  }

  getCategoriesWithTodos(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categoriesWithTodos`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.baseUrl}/todos`, todo);
  }

  updateTodo(todo: Todo): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/todos/${todo.id}`, todo);
  }

  getCategoriesUpdatedListener(): Observable<Category[]> {
    return this.categoriesUpdated.asObservable();
  }

  updateTodoStatus(id: string, status: TodoStatus): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/todos/${id}/status`, {
      status,
    });
  }

  uploadFileAttachment(todoId: string, formData: FormData): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/todos/${todoId}/fileattachments`,
      formData,
      {
        headers: {
          enctype: 'multipart/form-data',
        },
      }
    );
  }

  getFileAttachments(todoId: string): Observable<FileAttachment[]> {
    return this.http.get<FileAttachment[]>(
      `${this.baseUrl}/todos/${todoId}/fileattachments`
    );
  }

  downloadFileAttachment(attachmentId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/todos/fileattachments/${attachmentId}`,
      { responseType: 'blob' }
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${id}`);
  }

  // Outros métodos para criar, atualizar e deletar categorias e tarefas
}
