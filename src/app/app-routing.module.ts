import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProcessComponent } from './process/process.component';

const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"process",component:ProcessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
