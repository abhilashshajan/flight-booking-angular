import { Component, OnInit, Input } from '@angular/core';
import { PassingdataService } from '../services/passing-data/passing-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth/authentication.service';
import { FlightService } from '../services/flight/flight.service';
import { add } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  bookingForm: FormGroup;
  bookedFlight = this.datapass.getData();
  flightDetails: any;
  tripDetails: any;
  travellerList: Array<any> = [];
  couponForm: FormGroup;
  amount: any;
  coupon: any;
  changeValue: any;
  couponApplied: any;
  displayMessage = false;
  codeGenerated: any;
  couponList: any;

  constructor(private flightService: FlightService, private datapass: PassingdataService, private authService: AuthenticationService, private router: Router, private fb: FormBuilder) {
    this.bookingForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });
    this.couponForm = fb.group({
      coupon: [],
    })
  }

  ngOnInit(): void {

    this.tripDetails = localStorage.getItem('tripDetails');
    this.tripDetails = JSON.parse(this.tripDetails);
    if (this.tripDetails.booking == "oneway") {
      this.tripDetails.return = this.tripDetails.depature;
      localStorage.setItem('tripDetails', JSON.stringify(this.tripDetails));
    }
    this.flightDetails = localStorage.getItem('flightDetails');
    this.flightDetails = JSON.parse(this.flightDetails);
    this.getCoupons();
  }

  applyCoupon(amount: any, coupon: any) {
    this.displayMessage = true;
    this.couponApplied = Number(amount - Math.floor(amount * (coupon.coupon / 100)));
    this.flightDetails.price = this.couponApplied;
  }

  addTraveller(bookingForm: any) {
    this.travellerList.push(bookingForm.value);
    for (let i = 0; i < this.travellerList.length; i++) {
      this.changeValue = this.flightDetails.price * (i + 1)
    }
  }

  confirmBooking() {
    localStorage.setItem('travellerDetails', JSON.stringify(this.travellerList));
    console.log(this.travellerList)
    console.log(this.flightDetails)
    let pnrNum = {
      'pnrNumber': this.randomString()
    }
    let status = { 'status': 'Booked' }; let travelDate = { 'travelDate': this.tripDetails.depature };
    this.flightService.saveTravellerDetails(this.travellerList).subscribe((result) => {
    }, (err) => {
      console.log(err);
    });
    let addValue = Object.assign(pnrNum, status, travelDate);
    this.flightDetails = Object.assign(this.flightDetails, addValue);
    localStorage.setItem('flightDetails', JSON.stringify(this.flightDetails));
    this.flightService.confirmBookingDetails(this.flightDetails).subscribe((result) => {
    }, (err) => {
      console.log(err);
    });
    Swal.fire('Booking confirmed!');
    this.router.navigateByUrl('/home/booking/history');
  }

  logout() {
    this.authService.logOut()
  }


  randomString() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = 10;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    this.codeGenerated = randomstring;
    return this.codeGenerated;
  }

  getCoupons() {
    this.flightService.getFlightCoupon().subscribe((result) => {
      this.couponList = result;
      console.log(this.couponList)
    });

  }


}
