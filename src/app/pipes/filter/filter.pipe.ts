import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/models/task.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   * Filtro de tareas por estado
   * @param taskList Lista de tareas
   * @param state Id de estado a filtrar
   * @returns
   */
  transform(taskList: Task[] | null, state: number): Task[] | null {
    if(!taskList || state === -1) return taskList;
    const filterTask = taskList.filter((task:Task)=> task.state == state);
    return filterTask;
  }

}
