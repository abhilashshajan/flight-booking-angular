import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../services/flight/flight.service';
import { PassingdataService } from '../services/passing-data/passing-data.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth/authentication.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  booking = "oneway";
  exampleFlag = true;
  flights: any = [];
  edited = false;
  value: any;
  flightDetails = {};
  merge: any;

  constructor(public datepipe: DatePipe,private flightService: FlightService,private authService: AuthenticationService, private router: Router, private datapass: PassingdataService) {

    this.value = "";

  }

  ngOnInit(): void {
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

  searchFlights(form: NgForm): void {
    console.log(form.value)
    if (form.value.from == form.value.to) {
      Swal.fire('Choose different origin & destination');
    }
    else if (form.value.depature == '' || form.value.from == '' || form.value.to == '' || form.value.return == '' || form.value.traveller == '') {
      this.edited = false;
      Swal.fire('Mandatory fields required!');
    }
    else {
      this.edited = true;
      form.value.depature = new Date();
      form.value.depature = this.datepipe.transform(form.value.depature, 'dd-MM-yyyy');
      if(this.booking == "oneway"){
        console.log("enter")
        form.value.return = "null";
      }
      else{
        form.value.return = new Date();
        form.value.return = this.datepipe.transform(form.value.return, 'dd-MM-yyyy');
        this.value.return = form.value.return;
      }     
      this.flightService.searchFlight(form.value.from, form.value.to,form.value.depature,form.value.return).subscribe((result) => {
        this.flights = result;
        this.value = form.value;
      }, (err) => {
        console.log(err);
      });
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

}
