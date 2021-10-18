import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestcallService } from '../services/rest-calls/restcall.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Airline } from '../model/airline.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  airlineForm: FormGroup;
  airlineList:Array<Airline> = [];
  showAddBtn:boolean = true;

  constructor(private fb: FormBuilder, private restCall:RestcallService, private authService: AuthenticationService) {
    this.airlineForm = fb.group({
      id: [''],
      airlineName: ['', Validators.required],
      airlineCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      contactNumber: ['', [Validators.required, Validators.pattern('[- +()0-9]{6,}')]]
    });
   }

  ngOnInit(): void {
    this.getAllAirlines();
  }

  getAllAirlines(){
    let url = 'airline/getAll';
    this.restCall.get(url, Airline).subscribe(resp => {
      this.airlineList = resp;
    }, (err) => {
      console.log(err.error.message);
      alert(err.error.message);

    });
  }

  addAirline(airlineForm:any){
    if (this.airlineForm.valid) {
      let url = 'airline/add';
      let formData: Airline = Object.assign(airlineForm.value);
      let username = this.authService.getData("username");
      formData.updatedBy = username ? username : "";
      this.restCall.post(url, formData, Airline).subscribe(resp => {
      this.airlineList.push(resp);
      alert("Record created successfully!");
      this.resetForm();
      }, (err) => {
        console.log(err.error.message);
        alert(err.error.message);
  
      });
    }
  }

  updateAirline(airlineForm:any){
    if (this.airlineForm.valid) {
      let url = 'airline/update';
      let formData: Airline = Object.assign(airlineForm.value);
      let username = this.authService.getData("username");
      formData.updatedBy = username ? username : "";
      this.restCall.put(url, formData, Airline).subscribe(resp => {
      let objIndex = this.airlineList.findIndex((obj => obj.id == resp.id));
      this.airlineList[objIndex] = resp;
      alert("Record updated successfully!");
      this.resetForm();
      }, (err) => {
        console.log(err.error.message);
        alert(err.error.message);

      });
    }
  }

  deleteAirline(rowData:Airline){
    if (confirm("Are you sure you want to delete this record?")) {
      let url = 'airline/delete';
      let formData: Airline = Object.assign(rowData);
      const httpOptions = { body: formData };    
      this.restCall.delete(url, httpOptions).subscribe(() => {
        let objIndex = this.airlineList.findIndex((obj => obj.id == formData.id));
          if (objIndex > -1) {
            this.airlineList.splice(objIndex, 1);
          }
        alert("Record deleted successfully!");
        this.resetForm();
        }, (err) => {
          console.log(err.error.message);
          alert(err.error.message);
    
        });
    }
  }

  copyContentToFields(airline:Airline){
    this.airlineForm.controls['id'].setValue(airline.id);
    this.airlineForm.controls['airlineName'].setValue(airline.airlineName);
    this.airlineForm.controls['airlineCode'].setValue(airline.airlineCode);
    this.airlineForm.controls['contactNumber'].setValue(airline.contactNumber);
    this.showAddBtn = false;
  }

  resetForm(){
    this.airlineForm.reset();
    for (let control in this.airlineForm.controls) {
      this.airlineForm.controls[control].setErrors(null);
    }
    this.showAddBtn = true;
  }
  logout(){
    this.authService.logOut()
  }

}
