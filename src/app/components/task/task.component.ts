import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { State, Task } from 'src/models/task.model';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  $observableTask: Observable<Task[]>;
  stateValues = {...State}
  constructor(private dataService: DataService, private dialog: MatDialog){
    this.$observableTask = this.dataService.getListTask();
  }

  createTask(){
    this.dialog.open(NewTaskComponent, { width: '80vw', height:'auto', data: { edit: 0}})
  }

  deleteTask(id:string){
    this.dataService.deleteTask(id);
  }

  editTask(task:Task){
    this.dialog.open(NewTaskComponent, { width: '80vw', height:'auto', data: { edit: 1, task}})
  }
}
