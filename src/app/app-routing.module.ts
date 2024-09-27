import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { PersonComponent } from './components/person/person.component';

const routes: Routes = [
  { path: '', component: TaskComponent},
  { path: 'task', component: TaskComponent},
  { path: 'person', component: PersonComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
