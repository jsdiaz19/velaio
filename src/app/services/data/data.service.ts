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

  getListPerson(): Observable<person[]> {
    return this.subjectPerson.asObservable();
  }

  getListTask(): Observable<Task[]> {
    return this.subjectTask.asObservable();
  }

  addPerson(person: person): void {
    this.personList.push({...person, });
    this.emitNotificationPerson();
  }

  deletePerson(id: string){
    this.personList= this.personList.filter((person:person)=> person.id!== id);
    this.emitNotificationPerson();
  }

  editPerson( newPerson: person){
    const index = this.personList.findIndex((person:person)=> person.id === newPerson.id);
    this.personList[index]=newPerson;
    this.emitNotificationPerson();
  }

  emitNotificationPerson(): void {
    localStorage.setItem('person', JSON.stringify(this.personList));
    this.subjectPerson.next([...this.personList]);
  }

  addTask(task:Task){
    this.taskList.push(task);
    this.emitNotificationTask();
  }

  emitNotificationTask(): void {
    localStorage.setItem('task', JSON.stringify(this.taskList));
    this.subjectTask.next([...this.taskList]);
  }

  deleteTask(id:string):void {
    this.taskList= this.taskList.filter((task:Task)=> task.id!== id);
    this.emitNotificationTask();
  }

  getPersonByID(id:string): person {
    return this.personList.filter((person:person)=> person.id === id)[0];
  }

  editTask(editTask:Task){
    const index = this.taskList.findIndex((task:Task)=> task.id === editTask.id);
    this.taskList[index]= editTask;
    this.emitNotificationTask();
  }

 }
