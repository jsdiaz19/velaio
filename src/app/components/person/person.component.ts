import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { person } from 'src/models/person.model';
import { NewPersonComponent } from '../new-person/new-person.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent {
  personList: Observable<person[]>;
  constructor( private dataService: DataService, private dialog: MatDialog){
    this.personList = this.dataService.getListPerson();
  }

  /**
   * Crear una nueva persona
   */
  createPerson(){
    this.dialog.open(NewPersonComponent, { width: '40%', height:'50%', data: { edit: 0}});
  }

  deletePerson(person: person){
    this.dataService.deletePerson(person.id);
  }

  editPerson(person: person){
    this.dialog.open(NewPersonComponent, { width: '40%', height:'50%', data: {  person, edit:1}});
  }
}
