import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlightService } from '../services/flight/flight.service';
import { ScheduleService } from '../services/schedule/schedule.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/auth/authentication.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RestcallService } from '../services/rest-calls/restcall.service';
import { Airline } from '../model/airline.model';
import { FlightSchedule } from '../model/schedule.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit {
  airlineList: Array<Airline> = [];
  updateAirlineList: Array<Airline> = [];
  scheduleForm: FormGroup;
  airlineCode: any;
  scheduleList: any = [];
  updateScheduleForm: FormGroup;

  frequencyDropdownList:any = [];
  frequencyDropdownModel:any = [];
  frequencySelectedItems:any = [];
  frequencyDropdownSettings:IDropdownSettings = {};

  airlineCodeDropdownList:any = [];
  airlineCodeDropdownModel:any = [];
  airlineCodeSelectedItems:any = [];
  airlineCodeDropdownSettings:IDropdownSettings = {};


  updateFrequencyDropdownList:any = [];
  updateFrequencyDropdownModel:any = [];
  updateFrequencySelectedItems:any = [];
  updateFrequencyDropdownSettings:IDropdownSettings = {};

  updateAirlineCodeDropdownList:any = [];
  updateAirlineCodeDropdownModel:any = [];
  updateAirlineCodeSelectedItems:any = [];
  updateAirlineCodeDropdownSettings:IDropdownSettings = {};

  constructor(private fb: FormBuilder, 
    private authService: AuthenticationService, 
    private scheduleService: ScheduleService, 
    private flightService: FlightService, 
    private modalService: NgbModal,
    private restCall:RestcallService,
    private datePipe: DatePipe) {

    this.scheduleForm = fb.group({
      airline: [''],
      flightNumber: [''],
      departureAirport: [''],
      arrivalAirport: [''],
      frequency: [''],
      departureTime: [''],
      arrivalTime: [''],
      aircraftRegistration: [''],
      seatCount: [''],
      ticketPrice: ['']
    });
    this.updateScheduleForm = fb.group({
      id: [''],
      airline: [''],
      flightNumber: [''],
      departureAirport: [''],
      arrivalAirport: [''],
      frequency: [''],
      departureTime: [''],
      arrivalTime: [''],
      aircraftRegistration: [''],
      seatCount: [''],
      ticketPrice: ['']
    });

  }

  ngOnInit(): void {
    this.getAllFlightSchedules();
    this.initiateMultiDropdownMetaData();
  }

  async getAllAirlines(): Promise<Array<Airline>> {
    return new Promise((resolve, reject) => {
      let url = 'airline/getAll';
      this.restCall.get(url, Airline).subscribe(resp => {
        resolve(resp);
      }, (err) => {
        reject(err);  
      });
    });
  }

  getAllFlightSchedules(){
    let url = 'airline/schedule/getAll';
    this.restCall.get(url, FlightSchedule).subscribe(resp => {
      this.scheduleList = this.covertAndFormatDate(resp);
    }, (err) => {
      console.log(err.error.message);
      alert(err.error.message); 
    });
  }

  onOptionsSelected(value: string) {
    this.flightService.getAirlineWithParams(value).subscribe(resp => {
      this.airlineCode = resp;
    })
  }

  saveFlightSchedule(scheduleForm: any) {
    if (this.scheduleForm.valid) {
      let url = 'airline/schedule/add';
      let formData: any = Object.assign(scheduleForm.value);
      formData.airlineId = formData.airline[0].item_id;
      delete formData.airline;
      if(typeof formData.frequency != undefined && formData.frequency.length > 0){
        let dayId:string = "";
        for (let day of formData.frequency) {
          dayId = dayId.concat(day.item_id);
        }
        formData.frequency = dayId;
      }
      let username = this.authService.getData("username");
      formData.updatedBy = username ? username : "";
      this.restCall.post(url, formData, FlightSchedule).subscribe(resp => {
      this.scheduleList.push(this.covertAndFormatDate(resp));
      alert("Record created successfully!");
      this.resetForm(this.scheduleForm);
      }, (err) => {
        console.log(err.error.message);
        alert(err.error.message);
  
      });
    }
   
  }

  getSchedule() {
    this.scheduleService.getSchedule().subscribe(resp => {
      this.scheduleList = resp;
    });
  }


  openModal(targetModal: any, value: any) {
    console.log(value.frequency)
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
    this.updateScheduleForm.patchValue({
      id: value.id,
      flightNumber: value.flightNumber,
      departureAirport: value.departureAirport,
      arrivalAirport: value.arrivalAirport,
      departureTime: value.departureTime,
      arrivalTime: value.arrivalTime,
      aircraftRegistration: value.aircraftRegistration,
      seatCount: value.seatCount,
      ticketPrice: value.ticketPrice
    });

    const frequency = value.frequency;
    let frequencyArray = Array.from(frequency.toString()).map(Number);
    let dropdownItem:any = {};
    let frequencyDropdown = []
    for(let day of frequencyArray){
      dropdownItem = this.frequencyDropdownList.find((i:any) => i.item_id === day);
      frequencyDropdown.push(dropdownItem);
    }
    this.updateFrequencyDropdownModel = frequencyDropdown;

    dropdownItem = this.airlineCodeDropdownList.find((i:any) => i.item_id === value.id);

    this.updateAirlineCodeDropdownModel.push(dropdownItem);

  }

  updateFlightSchedule(updateScheduleForm: any) {
    if (this.updateScheduleForm.valid) {
      let url = 'airline/schedule/update';
      let formData: any = Object.assign(updateScheduleForm.value);
      formData.airlineId = formData.airline[0].item_id;
      delete formData.airline;
      if(typeof formData.frequency != undefined && formData.frequency.length > 1){
        let dayId:string = "";
        for (let day of formData.frequency) {
          dayId = dayId.concat(day.item_id);
        }
        formData.frequency = dayId;
      }
      let username = this.authService.getData("username");
      formData.updatedBy = username ? username : "";
      this.restCall.put(url, formData, FlightSchedule).subscribe(resp => {
        let objIndex = this.scheduleList.findIndex(((obj:any) => obj.id == resp.id));
        this.scheduleList[objIndex] = this.covertAndFormatDate(resp);
      alert("Record updated successfully!");
      this.resetForm(this.updateScheduleForm);
      }, (err) => {
        console.log(err.error.message);
        alert(err.error.message);
  
      });
    }
    this.modalService.dismissAll();
  }

  deleteSchedule(rowData: any) {
    if (confirm("Are you sure you want to delete this record?")) {
      let url = 'airline/schedule/delete';
      let formData: FlightSchedule = Object.assign(rowData);
      const httpOptions = { body: formData };    
      this.restCall.delete(url, httpOptions).subscribe(() => {
        let objIndex = this.scheduleList.findIndex(((obj:any) => obj.id == formData.id));
          if (objIndex > -1) {
            this.scheduleList.splice(objIndex, 1);
          }
        alert("Record deleted successfully!");
        this.resetForm(this.updateScheduleForm);
        }, (err) => {
          console.log(err.error.message);
          alert(err.error.message);
    
        });
    }
  }

  logout() {
    this.authService.logOut()
  }

  initiateMultiDropdownMetaData() {
    this.initiateFrequencyDropdown();
    this.initiateAirlineCodeDropdown();

    this.initiateUpdateFrequencyDropdown();
    this.initiateUpdateAirlineCodeDropdown();
  }

  initiateFrequencyDropdown() {
    this.frequencyDropdownList = [
      { item_id: 1, item_text: 'Sunday' },
      { item_id: 2, item_text: 'Monday' },
      { item_id: 3, item_text: 'Tuesday' },
      { item_id: 4, item_text: 'Wednesday' },
      { item_id: 5, item_text: 'Thursday' },
      { item_id: 6, item_text: 'Friday' },
      { item_id: 7, item_text: 'Saturday' }
    ];

    this.frequencyDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  async initiateAirlineCodeDropdown() {
    this.airlineCodeDropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.airlineList = await this.getAllAirlines();
    let dropdownList:any = [];
    if (typeof this.airlineList !== 'undefined' && this.airlineList.length > 0) {
      for (let airline of this.airlineList) {
        dropdownList.push(
          {item_id: airline.id, item_text: airline.airlineCode}
        );
      }
    }
    this.airlineCodeDropdownList = dropdownList;
  }
  initiateUpdateFrequencyDropdown() {
    this.updateFrequencyDropdownList = [
      { item_id: 1, item_text: 'Sunday' },
      { item_id: 2, item_text: 'Monday' },
      { item_id: 3, item_text: 'Tuesday' },
      { item_id: 4, item_text: 'Wednesday' },
      { item_id: 5, item_text: 'Thursday' },
      { item_id: 6, item_text: 'Friday' },
      { item_id: 7, item_text: 'Saturday' }
    ];

    this.updateFrequencyDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  async initiateUpdateAirlineCodeDropdown() {
    this.updateAirlineCodeDropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.updateAirlineList = await this.getAllAirlines();
    let dropdownList:any = [];
    if (typeof this.updateAirlineList !== 'undefined' && this.updateAirlineList.length > 0) {
      for (let airline of this.updateAirlineList) {
        dropdownList.push(
          {item_id: airline.id, item_text: airline.airlineCode}
        );
      }
    }
    this.updateAirlineCodeDropdownList = dropdownList;
  }
  onFrequencySelect(item: any) {
    this.frequencySelectedItems.push(item);
  }
  onFrequencySelectAll(items: any) {
    this.frequencySelectedItems = items;
  }
  onFrequencyDeSelect(item: any) {
      let objIndex = this.frequencySelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
      if (objIndex > -1) {
        this.frequencySelectedItems.splice(objIndex, 1);
      }
  }
  onFrequencyDeSelectAll(items: any){
    this.frequencySelectedItems = items;
  }


  onAirlineCodeSelect(item: any) {
    this.airlineCodeSelectedItems.push(item);
  }

  onAirlineCodeDeSelect(item: any) {
      let objIndex = this.airlineCodeSelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
      if (objIndex > -1) {
        this.airlineCodeSelectedItems.splice(objIndex, 1);
      }
  }

  resetForm(form: FormGroup){
    form.reset();
    for (let control in form.controls) {
      form.controls[control].setErrors(null);
    }
  }
  covertAndFormatDate(resp:any){
    if(Array.isArray(resp)){
      for(let element of resp){
        let departureTime = this.datePipe.transform(new Date(element.departureTime), 'HH:mm');
        let arrivalTime = this.datePipe.transform(new Date(element.arrivalTime), 'HH:mm');
        element.departureTime = departureTime;
        element.arrivalTime = arrivalTime;
      }
    } else {
      let departureTime = this.datePipe.transform(new Date(resp.departureTime), 'HH:mm');
      let arrivalTime = this.datePipe.transform(new Date(resp.arrivalTime), 'HH:mm');
      resp.departureTime = departureTime;
      resp.arrivalTime = arrivalTime;     
    }
    return resp;
  }

  onUpdateAirlineCodeSelect(item:any){
    this.updateAirlineCodeSelectedItems.push(item);
  }
  onUpdateAirlineCodeDeSelect(item:any){
    let objIndex = this.updateAirlineCodeSelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
    if (objIndex > -1) {
      this.updateAirlineCodeSelectedItems.splice(objIndex, 1);
    }
  }

  onUpdateFrequencySelect(item:any){
    this.updateFrequencySelectedItems.push(item);
  }
  onUpdateFrequencyDeSelect(item:any){
    let objIndex = this.updateFrequencySelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
    if (objIndex > -1) {
      this.updateFrequencySelectedItems.splice(objIndex, 1);
    }
  }
  onUpdateFrequencyDeSelectAll(items:any){
    this.updateFrequencySelectedItems = items;
  }
  onUpdateFrequencySelectAll(items:any){
    this.updateFrequencySelectedItems = items;
  }
}
