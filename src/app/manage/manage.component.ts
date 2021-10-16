import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthenticationService } from '../services/auth/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlightService } from '../services/flight/flight.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  flightDetails: any;
  travellerDetails: any;
  tripDetails: any;
  DATA: any;
  head: any;
  tableContent: any;
  date: any;
  check: any;
  statusCheck: any;
  manageDetails: Array<any> = [];

  constructor(private fb: FormBuilder, private flightService: FlightService, private authService: AuthenticationService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getHistory();
    this.flightDetails = localStorage.getItem('flightDetails');
    this.travellerDetails = localStorage.getItem('travellerDetails');
    this.flightDetails = JSON.parse(this.flightDetails);
    this.travellerDetails = JSON.parse(this.travellerDetails);
    console.log(this.flightDetails.pnrNumber)
  }

  public openPDF(): void {
    let DATA = document.getElementById('bookingdetails') as HTMLElement;

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('Booking-details.pdf');
    });
  }

  logout() {
    this.authService.logOut()
  }

  openModal(targetModal: any, manageBookingForm: any) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  getHistory() {
    this.flightService.getBookingHistory().subscribe((result) => {
      this.filterBasedOnStatus(result);
    }, (err) => {
      console.log(err);
    });
  }


  cancelBooking(id: any, pnrNumber: string) {
    this.flightService.cancelBookedFlight(pnrNumber).subscribe((result) => {
      this.manageDetails.splice(id, 1);
    });

  }

  filterBasedOnStatus(list: any) {
    for (var itr of list) {
      if (itr.status == "Booked") {
        this.manageDetails.push(itr);
      }
      console.log(this.manageDetails)
      var dateValue = new Date(itr.travelDate);
      var currentDate = Date.now();
      var previousDate = new Date(currentDate);
      var day = 60 * 60 * 24 * 1000;
      var previousDate1 = new Date(previousDate.getTime() + day);
      if (dateValue <= previousDate1) {
        this.check = "false";
      } else {
        this.check = "true";
      }
    }
  }

}
