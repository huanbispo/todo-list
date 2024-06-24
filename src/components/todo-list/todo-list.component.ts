import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { TodoService } from '../../service/todo.service';
import {
  Todo,
  Category,
  TodoStatus,
  FileAttachment,
} from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @Output() taskAdded = new EventEmitter<void>();

  categories: Category[] = [];
  todos: Todo[] = [];
  newTodo: Todo = {
    title: '',
    description: '',
    dueDate: new Date(),
    status: TodoStatus.Todo,
    categoryId: '',
  };
  selectedCategoryId: string | undefined;
  newTodoTitle: string = '';
  categoriesSub: Subscription | undefined;
  isEditMode: boolean = false;
  fileName: string | null = null;
  attachments: FileAttachment[] = [];
  selectedFile: File | null = null;

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
    this.todoService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  setTodoDetails(todo: Todo): void {
    this.newTodo = { ...todo };
    this.selectedCategoryId = todo.categoryId;
    this.isEditMode = true;
    this.loadAttachments(todo.id);
  }

  loadAttachments(todoId: string | undefined): void {
    if (todoId) {
      this.todoService.getFileAttachments(todoId).subscribe((attachments) => {
        this.attachments = attachments;
      });
    }
  }

  resetForm(): void {
    this.newTodo = {
      title: '',
      description: '',
      dueDate: new Date(),
      status: TodoStatus.Todo,
      categoryId: '',
    };
    this.selectedCategoryId = undefined;
    this.isEditMode = false;
    this.fileName = null;
    this.selectedFile = null;
    this.attachments = [];
  }

  addTodo(): void {
    if (this.newTodo.title.trim() && this.newTodo.categoryId) {
      this.todoService.createTodo(this.newTodo).subscribe((createdTodo) => {
        if (this.selectedFile && createdTodo.id) {
          this.uploadFile(createdTodo.id);
        }
        this.resetForm();
        this.taskAdded.emit(); // Emitir evento quando a tarefa for adicionada
        alert('Task added successfully!');
      });
    }
  }

  updateTodo(): void {
    if (
      this.newTodo.title.trim() &&
      this.newTodo.categoryId &&
      this.newTodo.id
    ) {
      this.todoService.updateTodo(this.newTodo).subscribe(() => {
        if (this.selectedFile && this.newTodo.id) {
          this.uploadFile(this.newTodo.id);
        }
        this.resetForm();
        this.taskAdded.emit(); // Emitir evento quando a tarefa for atualizada
        alert('Task updated successfully!');
      });
    } else {
      alert('Please fill all the fields');
    }
  }

  updateTitle(event: any): void {
    this.newTodo.title = this.extractImportantPart(event);
  }

  extractImportantPart(title: string): string {
    // Lógica simples para extrair a parte importante do título
    const words = title.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ');
    }
    return title;
  }

  selectFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  uploadFile(todoId: string): void {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('FileName', this.selectedFile.name);
      formData.append('FilePath', this.selectedFile);

      this.todoService.uploadFileAttachment(todoId, formData).subscribe(() => {
        alert('File uploaded successfully!');
        this.resetForm();
        this.fileInput.nativeElement.value = '';
      });
    }
  }

  downloadAttachment(attachment: FileAttachment): void {
    this.todoService
      .downloadFileAttachment(attachment.id)
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
}
