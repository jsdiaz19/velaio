import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { person } from 'src/models/person.model';
import { State, Task } from 'src/models/task.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * Validacion personalizada para permitir una cantidad minima de habilidades
 * @param min cantida minima aceptada
 * @returns
 */
export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minLengthArray: true };
    }
    return null;
  };
}

/**
 * Interface de input del dialogo
 */
export interface inputTask{
  edit: number;
  task: Task;
}


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent {
  stateTask = State;
  formgroup: FormGroup;
  minDate: Date = new Date();
  $observablePerson: Observable<person[]>;
  personControl: FormControl = new FormControl('');
  constructor(private dataService: DataService, private fb: FormBuilder, private dialogRef: MatDialogRef<NewTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: inputTask){
    this.$observablePerson = this.dataService.getListPerson();
    this.formgroup= new FormGroup({
      tittle: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      expired: new FormControl('', Validators.required),
      state: new FormControl(3),
      persons: this.fb.array([], minLengthArray(1))
    })

  }

  ngOnInit(){

    if( this.data.edit === 1){  // En caso de edita, se llena el formulario
      this.formgroup.get('tittle')?.setValue( this.data.task.tittle);
      this.formgroup.get('description')?.setValue( this.data.task.description);
      this.formgroup.get('expired')?.setValue( this.data.task.expired);
      this.formgroup.get('state')?.setValue( this.data.task.state);
      this.data.task.persons.forEach((id:string)=> {
        const control = this.fb.group({ person: [this.dataService.getPersonByID(id)]  });
        this.personArray.push(control);
      });

    }
  }

  /**
   * Getter para simplificar el acceso al form array
   */
  get personArray(): FormArray {
    return this.formgroup.get('persons') as FormArray;
  }

  /**
   * Getter para obtener las personas asignadas a la tarea
   */
  get personArrayValue() {
    return this.formgroup.get('persons')?.getRawValue().map( (x: {person:person}) => x.person);
  }

  /**
   * Crea o edita  tareas
   */
  createTask(){
    if( this.data.edit === 1){ this.editTask()} // En caso de edita, llama a la funcion editTask
    else {
      const formData = this.formgroup.getRawValue();
      const task = { ...formData, id: uuidv4(),state: State.ASSIGNED ,persons: formData.persons.map((x:{person: person})=> x.person.id)};
      this.dataService.addTask(task);
      this.dialogRef.close();
    }
  }

  /**
   * Edita tarea
   */
  editTask() {
    const formData = this.formgroup.getRawValue();
    const task = { ...formData, id: this.data.task.id, persons: formData.persons.map((x:{person: person})=> x.person.id)};
    this.dataService.editTask(task);
    this.dialogRef.close();
  }

  /**
   * Funcion personalizada para la visualizacion del autocomplete
   * @param person Objeto person
   * @returns
   */
  displayFn(person: person): string {
    return person && person.name ? person.name : '';
  }

  /**
   * Asigna a una persona a la tarea
   */
  addPerson(){
    const personForm = this.fb.group({ person: [this.personControl.value]  });
    this.personArray.push(personForm);
    this.personControl.reset();
  }

  /**
   * Desasigna a una persona de la tarea
   * @param index index de la persona a eliminar
   */
  removePerson(index:number){
    this.personArray.removeAt(index);
  }

  /**
   * Asigna estado a la tarea
   * @param state id del nuevo estado
   */
  setState(state: number){
    this.formgroup.get('state')?.setValue(state);
  }
}
