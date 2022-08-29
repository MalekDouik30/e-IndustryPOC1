import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { LoginService } from '../services/login.service';
import { ProcessService } from '../services/process.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  userFirstName:string
  userLastName:string
  listApplications:any[]=[] // Array to get Application
  listProcessOfSelectedApp:any[]=[] // Array to get Process of selected Application
  listInstanceProcess:any[]=[]
  listTask:any[]=[]// Array to get the current Task of selected instance process
  listTaskContent:any[]=[]

  // To refresh page
  appDefinitionKeyVar:string
  processIdVar:string

  formData: any;
  idTask:any;
  idForm:any;

  constructor(private loginS:LoginService,private applicationS:ApplicationService,private processS:ProcessService,
    private router:Router) { }


  ngOnInit(): void {
    // Get user information
    this.loginS.getUserParams().subscribe(
      (res:any)=>{
        this.userFirstName=res.firstName
        this.userLastName=res.lastName
      }
    )

    // Get application
    this.applicationS.getApplication().subscribe(
      (res:any)=>{
        for(let item of res.data){
          if(item.appDefinitionId !=null){
            item.icon = "glyphicon "+item.icon // change icon
            this.listApplications.push(item)
          }
        }
      },err=>{
          console.error("Erreur web service getApplicationAndProcess")
          console.log(err)
      })
    }

  onSignOut(){
    this.loginS.logOut().subscribe(res=>{
      this.router.navigate(['login']);
    },err=>{
      console.error(err)
    })
  }

  onSelectedAppliction(appDefinitionKey:string){
    this.appDefinitionKeyVar=appDefinitionKey
    this.listProcessOfSelectedApp=[]
    this.processS.getProcessByApplicationService(appDefinitionKey).subscribe((res:any)=>{
      for(let item of res.data){
        this.listProcessOfSelectedApp.push(item)
      }
      },err=>{
      console.error("Erreur web service getProcessByApplicationService")
      console.log(err)
      })
    }

  onSelectProcess(processId:string){
    this.processIdVar=processId
    this.listInstanceProcess=[]
    this.processS.getProcessInstancesByProcessDefinitionId(processId).subscribe((res:any)=>{
      for(let item of res.data){
        console.log(item)
        this.listInstanceProcess.push(item)
      }
    },err=>{
      console.error("Erreur web service getProcessInstancesByProcessDefinitionId")
      console.log(err)
      })
   }

  onCancelInstanceProcess(idProcess:string){
    this.processS.deleteProcessInstance(idProcess).subscribe((res:any)=>{
      // refrech page 
      this.onSelectedAppliction(this.appDefinitionKeyVar)
      this.onSelectProcess(this.processIdVar)
    },err=>{
      console.error("Erreur web service deleteProcessInstanceService")
      console.log(err)
      })
  }

  onCreateProcessInstance(process:any){
    let name:string;
    const now = new Date();
    name = process.name +" "+now.toUTCString()
    this.processS.postProcessInstance(process.id,name).subscribe((res:any)=>{
       // refrech page 
      this.onSelectedAppliction(this.appDefinitionKeyVar)
      this.onSelectProcess(this.processIdVar)
    },err=>{
      console.error("Erreur web service postProcessInstanceService")
      console.log(err)
    })
  }

  onSelectInstanceProcess(instanceProcessid:string){
    this.listTask=[]
    this.listTaskContent=[]
    this.processS.getTaskByIdProcessInstance(instanceProcessid).subscribe((res:any)=>{
      this.listTask.push(res.data)
        // Form of Task
        this.processS.getTaskFormByIdTask(res.data[0].id).subscribe((res2:any)=>{
          console.log(res2)
          this.formData =res2
          console.log(res2)
          this.idForm=res2.id
          this.idTask=res.data[0].id
        },err=>{
          console.error("Erreur web service getTaskByIdProcessInstanceService")
          console.log(err)
        })
      
    },err=>{
      console.error("Erreur web service getTaskByIdProcessInstanceService")
      console.log(err)
    })
  }


  

  

}
