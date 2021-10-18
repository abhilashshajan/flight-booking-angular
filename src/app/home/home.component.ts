import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../services/flight/flight.service';
import { PassingdataService } from '../services/passing-data/passing-data.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth/authentication.service';
import { DatePipe } from '@angular/common'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FlightSchedule } from '../model/schedule.model';
import { RestcallService } from '../services/rest-calls/restcall.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  booking = "oneway";
  exampleFlag = true;
  flights: any = [];
  edited = false;
  value: any;
  flightDetails = {};
  merge: any;
  flightScheduleList:any = [];

  departureAirportDropdownSettings:IDropdownSettings = {};
  departureAirportDropdownList:any = [];
  departureAirportDropdownModel:any = [];
  departureAirportSelectedItems:any = [];

  arrivalAirportDropdownSettings:IDropdownSettings = {};
  arrivalAirportDropdownList:any = [];
  arrivalAirportDropdownModel:any = [];
  arrivalAirportSelectedItems:any = [];


  constructor(public datepipe: DatePipe,
    private flightService: FlightService,
    private authService: AuthenticationService, 
    private router: Router, 
    private datapass: PassingdataService,
    private restCall:RestcallService,
    private datePipe: DatePipe) {

    this.value = "";

  }

  ngOnInit(): void {
    this.initiateDepartureArrivalAirportDropdown();
  }

  changeBooking(e: any) {
    if (e.target.value == "roundtrip") {
      this.booking = "roundtrip";
      this.exampleFlag = false;
    }
    else if (e.target.value == "multicity") {
      this.booking = "multicity";
      this.exampleFlag = false;
    }
    else {
      this.booking = "oneway";
      this.exampleFlag = true;
    }
  }
  async getAllFlightSchedules(): Promise<Array<FlightSchedule>> {
    return new Promise((resolve, reject) => {
      let url = 'airline/schedule/getAll';
      this.restCall.get(url, FlightSchedule).subscribe(resp => {
        resolve(resp);
      }, (err) => {
        reject(err);  
      });
    });
  }
  async searchFlights(form: NgForm): Promise<void> {
    console.log(form.value)
    if (form.value.depatureDate == '' || form.value.departureAirport.legth == 0 || form.value.arrivalAirport.legth == 0 || form.value.returnDate == '' || form.value.passengerCount == '') {
      this.edited = false;
      Swal.fire('Mandatory fields required!');
    } else if (form.value.departureAirport[0].item_text == form.value.arrivalAirport[0].item_text) {
      Swal.fire('Choose different origin & destination');
    }
    else {
      this.edited = true;
      //form.value.depatureDate = new Date();
      form.value.depatureDate = this.datepipe.transform(form.value.depatureDate, 'dd-MM-yyyy');
      if(this.booking == "oneway"){
        console.log("enter")
        form.value.returnDate = null;
      }
      else{
        //form.value.returnDate = new Date();
        form.value.returnDate = this.datepipe.transform(form.value.returnDate, 'dd-MM-yyyy');
        //this.value.returnDate = form.value.returnDate;
      }     
      // this.flightService.searchFlight(form.value.departureAirport, form.value.arrivalAirport,form.value.depatureDate,form.value.returnDate).subscribe((result) => {
      //   this.flights = result;
      //   this.value = form.value;
      // }, (err) => {
      //   console.log(err);
      // });
      this.flights = [];
      this.flightScheduleList = await this.getAllFlightSchedules();
      if(this.booking == "oneway"){
        let frequencyArray;
        let departureDay;
        console.log(this.flightScheduleList);
        for (let flightSchedule of this.flightScheduleList) {
          frequencyArray = Array.from(flightSchedule.frequency.toString()).map(Number);
          departureDay = new Date(form.value.departureDate).getDay()+1;
          if (frequencyArray.includes(departureDay) &&
          flightSchedule.departureAirport == form.value.departureAirport[0].item_text &&
          flightSchedule.arrivalAirport == form.value.arrivalAirport[0].item_text) {
            flightSchedule.duration = this.getDifferenceInHours(new Date(flightSchedule.arrivalTime), new Date(flightSchedule.departureTime));
            flightSchedule.departureTime = this.datePipe.transform(new Date(flightSchedule.departureTime), 'HH:mm');
            flightSchedule.arrivalTime = this.datePipe.transform(new Date(flightSchedule.arrivalTime), 'HH:mm'); 
            this.flights.push(flightSchedule);
          }
        }
      } else {
        let frequencyArray;
        let departureDay;
        let returneDay;
        console.log(this.flightScheduleList);
        for (let flightSchedule of this.flightScheduleList) {
          frequencyArray = Array.from(flightSchedule.frequency.toString()).map(Number);
          departureDay = new Date(form.value.departureDate).getDay()+1;
          returneDay = new Date(form.value.returnDate).getDay()+1;
          if ( (frequencyArray.includes(departureDay) || frequencyArray.includes(returneDay)) &&
          (flightSchedule.departureAirport == form.value.departureAirport[0].item_text &&
          (flightSchedule.arrivalAirport == form.value.arrivalAirport[0].item_text) || (flightSchedule.departureAirport == form.value.arrivalAirport[0].item_text &&
            flightSchedule.arrivalAirport == form.value.departureAirport[0].item_text)) ) {
              flightSchedule.duration = this.getDifferenceInHours(new Date(flightSchedule.arrivalTime), new Date(flightSchedule.departureTime));
              flightSchedule.departureTime = this.datePipe.transform(new Date(flightSchedule.departureTime), 'HH:mm');
              flightSchedule.arrivalTime = this.datePipe.transform(new Date(flightSchedule.arrivalTime), 'HH:mm');  
              this.flights.push(flightSchedule);
          }
        }   
      }
    }
  }

  bookFlight(flight: any) {
    this.datapass.setData(flight);
    localStorage.setItem('flightDetails', JSON.stringify(flight));
    localStorage.setItem('tripDetails', JSON.stringify(this.value));
    console.log(localStorage.getItem('tripDetails'));
    this.router.navigateByUrl('/home/booking');
  }

  logout(){
    this.authService.logOut()
  }

  async initiateDepartureArrivalAirportDropdown() {
    this.departureAirportDropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.arrivalAirportDropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.flightScheduleList = await this.getAllFlightSchedules();
    let departureDropdownList:any = [];
    let arrivalDropdownList:any = [];
    if (typeof this.flightScheduleList !== 'undefined' && this.flightScheduleList.length > 0) {
      for (let schedule of this.flightScheduleList) {
        departureDropdownList.push(
          {item_id: schedule.departureAirport, item_text: schedule.departureAirport}
        );
        arrivalDropdownList.push(
          {item_id: schedule.arrivalAirport, item_text: schedule.arrivalAirport}
        );
      }
    }
    const uniqueDepartureDropdownList = [...new Map(departureDropdownList.map((item:any) =>
      [item["item_id"], item])).values()];
      const uniqueArrivalDropdownList = [...new Map(arrivalDropdownList.map((item:any) =>
        [item["item_id"], item])).values()];

    this.departureAirportDropdownList = uniqueDepartureDropdownList;
    this.arrivalAirportDropdownList = uniqueArrivalDropdownList;
  }

  onDepartureAirportSelect(item:any){
    this.departureAirportSelectedItems.push(item);
  }
  onDepartureAirportDeSelect(item:any){
    let objIndex = this.departureAirportSelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
    if (objIndex > -1) {
      this.departureAirportSelectedItems.splice(objIndex, 1);
    }
  }

  onArrivalAirportSelect(item:any){
    this.arrivalAirportSelectedItems.push(item);
  }
  onArrivalAirportDeSelect(item:any){
    let objIndex = this.arrivalAirportSelectedItems.findIndex(((obj:any) => obj.item_id == item.item_id));
    if (objIndex > -1) {
      this.arrivalAirportSelectedItems.splice(objIndex, 1);
    }
  }
  getDifferenceInHours(date1:Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return diffInMs / (1000 * 60 * 60);
  }

}
