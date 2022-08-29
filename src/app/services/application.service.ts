import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http:HttpClient) { }
  private API_URL= environment;

  getApplication():Observable<any>{
    // Get user information
    return this.http.get<any>(this.API_URL.flowable_task+"app/rest/runtime/app-definitions")
  }


}
