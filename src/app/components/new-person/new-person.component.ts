import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { DataService } from 'src/app/services/data/data.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { person } from 'src/models/person.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minLengthArray: true };
    }
    return null;
  };
}

export interface inputPerson{
  edit: number;
  person: person;
}

@Component({
  selector: 'app-new-person',
  templateUrl: './new-person.component.html',
  styleUrls: ['./new-person.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class NewPersonComponent {
  formGroup: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  constructor(private dataService: DataService, private fb: FormBuilder, private dialogRef: MatDialogRef<NewPersonComponent>,  @Inject(MAT_DIALOG_DATA) public data: inputPerson ){
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
      age: new FormControl('', Validators.compose([ Validators.required, Validators.min(18)])),
      skills: this.fb.array([], minLengthArray(1))
    })
  }

  ngOnInit(){
    if( this.data.edit === 1){ // En caso de editar, se llena el formulario con los datos de la persona
      this.formGroup.get('name')?.setValue(this.data.person.name);
      this.formGroup.get('age')?.setValue(this.data.person.age);
      this.data.person.skills.forEach((skill)=> this.skillsArray.push( this.fb.group({ skill: [skill]  })))
    }

  }

  /**
   * Getter para simplificar el acceso al form array
   */
  get skillsArray(): FormArray {
    return this.formGroup.get('skills') as FormArray;
  }

  /**
   * Elimina una habilidad especifica
   * @param index index de la habilidad a eliminar
   */
  remove(index: number): void {
    this.skillsArray.removeAt(index);
  }

  /**
   * Agrega la habilidad del usuario al form array
   * @param $event evento matChip donde se obtiene la habilidad a agregar
   */
  add($event: MatChipInputEvent){
    const habilidadForm = this.fb.group({ skill: [$event.value]  });
    this.skillsArray.push(habilidadForm);
    $event.chipInput!.clear();

  }

  /**
   * Crea o edita persona en el sistema
   */
  createPerson(){
    let formData = this.formGroup.getRawValue();
    if( this.data.edit === 0){ // Bandera para crear persona
      const person = { id: uuidv4(), name: formData.name, age: formData.age, skills: formData.skills.map((skills:any)=> skills.skill)}
      this.dataService.addPerson(person);
    }else{
      const person = { id: this.data.person.id, name: formData.name, age: formData.age, skills: formData.skills.map((skills:any)=> skills.skill)};
      this.dataService.editPerson(person);
    }
    this.dialogRef.close();
  }


}
