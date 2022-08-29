import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private http:HttpClient) { }
  private API_URL= environment;

  getProcessByApplicationService(appDefinitionKey:string):Observable<any>{
    // Get All active process of application
    return this.http.get<any>(this.API_URL.flowable_task+"app/rest/process-definitions?latest=true&appDefinitionKey="+appDefinitionKey)
  }

  getProcessInstancesByProcessDefinitionId(processDefinitionId:string){
    // Get Process instance by processDefinitionId
    return this.http.get<any>(this.API_URL.flowable_task+"process-api/runtime/process-instances?processDefinitionId="+processDefinitionId)
  }

  deleteProcessInstance(idInstanceProcess:string){
    //delete instance process
    return this.http.delete(this.API_URL.flowable_task+"app/rest/process-instances/"+idInstanceProcess)
  }
  
  postProcessInstance(id:string,name:string){
    //Create instance process
    const processModel = {
     'processDefinitionId': "",
     'name':""
    };
   processModel.processDefinitionId=id
   processModel.name=name

   return this.http.post(this.API_URL.flowable_task+"app/rest/process-instances", processModel);
 }

 getTaskByIdProcessInstance(idInstanceProcess:string){
  return this.http.get(this.API_URL.flowable_task+'process-api/runtime/tasks?processInstanceId='+idInstanceProcess)
}

getTaskFormByIdTask(idTask:string){
  return this.http.get(this.API_URL.flowable_task+'app/rest/task-forms/'+ idTask)
}

postDataForm(formData:any,idTask:string,idForm:string){
  const bodyRequest:JSON = <JSON><unknown>{
    values: formData,
    formId: idForm
  }
  return this.http.post(this.API_URL.flowable_task+'app/rest/task-forms/'+idTask, bodyRequest);
}

postUploadFileProcess(file:any){
  return this.http.post(this.API_URL.flowable_task+'app/rest/content/raw',file);
}

deleteUploadedFile(idFile:string){
  return this.http.delete(this.API_URL.flowable_task+'app/rest/content/'+idFile)
}






}
