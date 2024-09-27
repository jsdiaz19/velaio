import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { person } from 'src/models/person.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private personList: person[] = [];
  subjectPerson: Subject<person[]> = new Subject();
  constructor() { }

  getListPerson(): Observable<person[]> {
    return this.subjectPerson.asObservable();
  }

  addPerson(person: person): void {
    this.personList.push({...person, });
    this.subjectPerson.next([...this.personList]);
  }

  deletePerson(id: string){
    this.personList= this.personList.filter((person:person)=> person.id!== id);
    this.subjectPerson.next([...this.personList]);
  }
 }
