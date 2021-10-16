import { Component, OnInit } from '@angular/core';
import { PassingdataService } from '../services/passing-data/passing-data.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { FlightService } from '../services/flight/flight.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
bookingHistory:any;
flightDetails:any;
tripDetails:any;
username:any;
constructor(private flightService:FlightService,private datapass: PassingdataService,private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.flightService.getBookingHistory().subscribe((result) => {
      this.bookingHistory = result; 
      console.log(this.bookingHistory);

    }, (err) => {
      console.log(err);
    });   
    
  }
  
  logout(){
    this.authService.logOut()
  }
}
