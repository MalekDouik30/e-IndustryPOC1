import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_URL= environment;
  constructor(private http:HttpClient) { }

  postlogin(username:string,password:string):Observable<any>{
    return this.http.post<any>(this.API_URL.flowable_idm+"app/authentication?j_username="+username+"&j_password="+password+"&_spring_security_remember_me=true&submit=Login","")      
  }

  getUserParams():Observable<any>{
    // Get user information
    return this.http.get<any>(this.API_URL.flowable_task+"app/rest/account")
  }

  logOut():Observable<any>{
    return this.http.get<any>(this.API_URL.flowable_task+"app/logout")
  }



}
