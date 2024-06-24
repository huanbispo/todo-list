import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TodoService } from '../../service/todo.service';
import { Category, Todo, TodoStatus } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @Output() categoryAdded = new EventEmitter<void>();
  @Output() todoSelected = new EventEmitter<Todo>();

  categories: Category[] = [];
  private categoriesSub: Subscription | undefined;
  showCategoryInput = false;
  newCategoryName = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.categoriesSub = this.todoService
      .getCategoriesUpdatedListener()
      .subscribe(() => {
        this.loadCategories();
      });
  }

  loadCategories(): void {
    this.todoService.getCategoriesWithTodos().subscribe((categories) => {
      this.categories = categories;
    });
  }

  toggleTodoStatus(todo: Todo): void {
    const newStatus =
      todo.status === TodoStatus.Todo ? TodoStatus.Completed : TodoStatus.Todo;
    if (todo.id) {
      this.todoService.updateTodoStatus(todo.id, newStatus).subscribe(() => {
        todo.status = newStatus;
      });
    } else {
      console.error('Todo ID not found');
    }
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        name: this.newCategoryName.trim(),
        todos: [],
      };
      this.todoService.createCategory(newCategory).subscribe(() => {
        this.loadCategories();
        this.newCategoryName = '';
        this.showCategoryInput = false;
        this.categoryAdded.emit(); // Emitir evento quando a categoria for adicionada
      });
    }
  }

  viewTodoDetails(todo: Todo): void {
    this.todoSelected.emit(todo); // Emitir evento com os detalhes da tarefa
  }

  deleteTodo(todo: Todo): void {
    if (todo.id) {
      this.todoService.deleteTodo(todo.id).subscribe(() => {
        this.loadCategories();
      });
    } else {
      console.error('Todo ID not found');
    }
  }
}
