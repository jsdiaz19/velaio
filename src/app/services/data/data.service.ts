import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { person } from 'src/models/person.model';
import { Task } from 'src/models/task.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private personList: person[] = [];
  private taskList: Task[] = [];
  subjectPerson: BehaviorSubject<person[]> = new BehaviorSubject<person[]>([]);
  subjectTask: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  constructor() {
    this.personList = JSON.parse(localStorage.getItem('person') ?? '[]');
    this.taskList = JSON.parse(localStorage.getItem('task') ?? '[]');
    this.subjectPerson.next([...this.personList]);
    this.subjectTask.next([...this.taskList]);
  }

  /**
   * Obtiene observable de cambios en la lista de personas
   * @returns
   */
  getListPerson(): Observable<person[]> {
    return this.subjectPerson.asObservable();
  }

  /**
   * Obtiene observable de cambios en la lista de tareas
   * @returns
   */
  getListTask(): Observable<Task[]> {
    return this.subjectTask.asObservable();
  }

  /**
   * Agrega una nueva persona y notifica el cambio
   * @param person Objeto persona
   */
  addPerson(person: person): void {
    this.personList.push({...person, });
    this.emitNotificationPerson();
  }

  /**
   * Eliminar una persona y notifica el cambio
   * @param id Id de la persona a eliminar
   */
  deletePerson(id: string){
    this.personList= this.personList.filter((person:person)=> person.id!== id);
    this.emitNotificationPerson();
  }

  /**
   * Edita una persona
   * @param newPerson Objeto con los nuevos datos de la persona
   */
  editPerson( newPerson: person){
    const index = this.personList.findIndex((person:person)=> person.id === newPerson.id);
    this.personList[index]=newPerson;
    this.emitNotificationPerson();
  }

  /**
   * Notifica cambio en listado de persona a todos los observadores
   */
  emitNotificationPerson(): void {
    localStorage.setItem('person', JSON.stringify(this.personList));
    this.subjectPerson.next([...this.personList]);
  }

  /**
   * Agrega tarea y notifica cambio
   * @param task
   */
  addTask(task:Task){
    this.taskList.push(task);
    this.emitNotificationTask();
  }

  /**
   * Notifica el cambio en el listado de tareas  a todos los observadores
   */
  emitNotificationTask(): void {
    localStorage.setItem('task', JSON.stringify(this.taskList));
    this.subjectTask.next([...this.taskList]);
  }

  /**
   * Eliminar una tarea y notifica el cambio
   * @param id Id de la tarea a eliminar
   */
  deleteTask(id:string):void {
    this.taskList= this.taskList.filter((task:Task)=> task.id!== id);
    this.emitNotificationTask();
  }

  /**
   * Obtiene los datos de una persona basado en su ID
   * @param id Id de la persona
   * @returns
   */
  getPersonByID(id:string): person {
    return this.personList.filter((person:person)=> person.id === id)[0];
  }

  /**
   * Edita tarea
   * @param editTask Objeto tarea con los nuevos datos
   */
  editTask(editTask:Task){
    const index = this.taskList.findIndex((task:Task)=> task.id === editTask.id);
    this.taskList[index]= editTask;
    this.emitNotificationTask();
  }

 }
