import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { Todo } from '../models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('todoList') todoList!: TodoListComponent;
  @ViewChild('categoryList') categoryList!: CategoryListComponent;
  title = 'todo-list';

  ngAfterViewInit() {
    // Garantir que todoList está inicializado após a inicialização da view
  }

  onCategoryAdded() {
    if (this.todoList) {
      this.todoList.loadCategories();
    }
  }

  onTaskAdded() {
    if (this.categoryList) {
      this.categoryList.loadCategories();
    }
  }

  onTodoSelected(todo: Todo) {
    if (this.todoList) {
      this.todoList.setTodoDetails(todo);
    }
  }
}
