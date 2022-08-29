import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,private loginS:LoginService,private router:Router) { }
  testAuthentification:Boolean

  public myForm: FormGroup = this.fb.group({
    passwordInput: new FormControl(''),
    usernameInput: new FormControl(''),
  });

  ngOnInit(): void {
  }

  onSubmit() {
    //console.log('Form values: ', this.myForm.value);
    this.loginS.postlogin(this.myForm.value.usernameInput,this.myForm.value.passwordInput).subscribe(
      (res:any)=>{
        this.router.navigate(['process']);
      },
      err=>{
        this.testAuthentification=true
        console.log(err)
        
      }
    )
  }

  

}
