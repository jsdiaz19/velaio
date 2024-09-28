import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/models/task.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(taskList: Task[] | null, state: number): Task[] | null {

    if(!taskList || state === -1) return taskList;
    const filterTask = taskList.filter((task:Task)=> task.state == state);
    return filterTask;
  }

}
