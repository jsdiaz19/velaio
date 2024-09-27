import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DataService } from 'src/app/services/data/data.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { person } from 'src/models/person.model';

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
  styleUrls: ['./new-person.component.scss']
})
export class NewPersonComponent {
  formGroup: FormGroup;
  readonly separatorKeysCodes = [ENTER] as const;
  addOnBlur = true;
  constructor(private dataService: DataService, private fb: FormBuilder, private dialogRef: MatDialogRef<NewPersonComponent>,  @Inject(MAT_DIALOG_DATA) public data: inputPerson ){
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
      age: new FormControl('', Validators.compose([ Validators.required, Validators.min(19)])),
      skills: this.fb.array([], minLengthArray(1))
    })
  }

  ngOnInit(){
    if( this.data.edit === 1){
      this.formGroup.setValue( this.data.person)
    }
  }

  get skillsArray(): FormArray {
    return this.formGroup.get('skills') as FormArray;
  }


  remove(index: number): void {
    this.skillsArray.removeAt(index);
  }

  add($event: MatChipInputEvent){
    const habilidadForm = this.fb.group({
      skill: [$event.value, Validators.required],
    });
    this.skillsArray.push(habilidadForm);
    $event.chipInput!.clear();

  }

  createPerson(){
    let formData = this.formGroup.getRawValue();
    const person = { id: uuidv4(), name: formData.name, age: formData.age, skills: formData.skills.map((skills:any)=> skills.skill)}
    this.dataService.addPerson(person);
    this.dialogRef.close()
  }


}
