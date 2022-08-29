import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component,ChangeDetectionStrategy,OnChanges,Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormControl } from '@angular/forms';
import { ProcessService } from '../services/process.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

export interface JsonFormData {
  id: string
  name: string
  description: any
  key: string
  version: number
  fields: Field[]
  outcomes: any[]
  outcomeVariableName: any
}

export interface Field {
  fieldType: string
  id: string
  name: string
  type: string
  value: any
  required: boolean
  readOnly: boolean
  overrideId: boolean
  placeholder?: string
  layout: any
  params?: Params
  optionType: any
  hasEmptyValue: any
  options?: Option[]
  optionsExpression: any
}

interface Params {
  regexPattern?: string
  minLength?: string
  maxLength?: string
}

interface Option {
  id: any
  name: string
}

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.css']
})
export class JsonFormComponent implements OnChanges {

  @Input() jsonFromData:JsonFormData;
  @Input() idTaskJsonComponent:string;
  @Input() idFormJsonComponent:string;

  public myForm: FormGroup = this.fb.group({});
  constructor( private fb: FormBuilder,private http:HttpClient,private processS:ProcessService ) { }
 
  public API_URL= environment;
  habibArray:any[]=[]

  ngOnChanges(changes: SimpleChanges) {
    if(changes['jsonFromData'] && this.jsonFromData){
      this.createForm(this.jsonFromData.fields);
    }
  }
  createForm(controls: Field[]){
    for (const i of controls) {
      const validatorsToAdd = [];
      if(i.type=='integer'){
        i.type='number'
      }
      if(i.type=='multi-line-text'){
        i.type='textarea'
      }
      if(i.type=='booelan'){
        i.type='checkbox'
      }
      if(i.type =='radio-buttons'){
        i.type='radio'
      }
      if(i.params!=null){
        for (const [key, value] of Object.entries(i.params )) {
          switch (key) {
            case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'regexPattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          }

        }
      }
       i.name=i.id // We do like this to make the myForm in the form of the body of the flowable post request
       this.myForm.addControl(
        i.name,this.fb.control(i.value,validatorsToAdd) 
      );
   }
  }

  onSubmit() {
    for(let item of this.habibArray){
      this.myForm.value[item] = item.idFile
    }
    for (const [key, value] of Object.entries(this.myForm.value )) {
      if(Array.isArray(value) && value.length ==0){
        this.myForm.value[key]=null
      }
      if(Array.isArray(value) && value.length >0){
        for(let i of value){
          this.myForm.value[key]=i.id
        }
      }
    }
      this.processS.postDataForm(this.myForm.value,this.idTaskJsonComponent,this.idFormJsonComponent).subscribe(
        res=>{
          console.log("Sucess Post")
        },err=>{
          console.error("Failed Post")
          console.log(err)
        }
      )
  }

 /* verifUpladedValueArray(myForm:any){
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    console.log(myForm.value)
    for (let [key, value] of Object.entries(myForm.value)) {
        if(Array.isArray(value) && value.length>0){
          myForm.value=myForm.value[0].id
        }
        if(Array.isArray(value) && value.length==0){
          myForm.value=null
        }
      }
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
      console.log(myForm.value)
  }*/

  onUploadFile(file:any,nameFile:any){
  

    this.myForm.value[nameFile]=""
    var fd = new FormData();
    fd.append('file', file.srcElement.files[0]);  
    this.processS.postUploadFileProcess(fd).subscribe(
      (res:any)=>{

        this.myForm.value[nameFile]= res.id 
        // Test
        this.habibArray.push({
          champs:nameFile,
          idFile:res.id
        });
        // End test

        console.log("Sucess File Post")
      },err=>{
        console.error("Failed File Post")
        console.log(err)
      }
    )

  }

  onRemoveFile(idFile:string){
    this.processS.deleteUploadedFile(idFile).subscribe(
      res=>{
        console.log("Sucess Delete")
      },err=>{
        console.error("Failed Delete")
        console.log(err)
      }
    )
  }






}



