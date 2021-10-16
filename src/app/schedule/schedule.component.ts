import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlightService } from '../services/flight/flight.service';
import { ScheduleService } from '../services/schedule/schedule.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  airlineList: any;
  scheduleForm: FormGroup;
  airlineCode: any;
  scheduleList: any;
  updateScheduleForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private scheduleService: ScheduleService, private flightService: FlightService, private modalService: NgbModal) {
    this.scheduleForm = fb.group({
      airlineName: [''],
      airlineCode: [''],
      origin: [''],
      destination: [''],
      frequency: [''],
      depatureTime: [''],
      arrivalTime: [''],
      price: ['']
    });
    this.updateScheduleForm = fb.group({
      id: [''],
      airlineName: [''],
      airlineCode: [''],
      origin: [''],
      destination: [''],
      frequency: [''],
      depatureTime: [''],
      arrivalTime: [''],
      price: ['']
    });

  }

  ngOnInit(): void {
    this.getAirline();
    this.getSchedule();
  }

  getAirline() {
    this.flightService.getAirline().subscribe(resp => {
      this.airlineList = resp;
    })
  }

  onOptionsSelected(value: string) {
    this.flightService.getAirlineWithParams(value).subscribe(resp => {
      this.airlineCode = resp;
    })
  }

  saveScheduleAirline(scheduleForm: any) {
    this.scheduleService.saveScheduleDetails(scheduleForm.value).subscribe(resp => {
      console.log(resp);
      this.scheduleForm.reset();
      this.getSchedule();
      this.getAirline();
    });
   
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
      airlineName: value.airlineName,
      airlineCode: value.airlineCode,
      origin: value.origin,
      destination: value.destination,
      frequency: value.frequency,
      depatureTime: value.depatureTime,
      arrivalTime: value.arrivalTime,
      price: value.price
    });

  }

  updateSchedule(updateScheduleForm: any) {
    this.scheduleService.updateSchedule(updateScheduleForm.value.id, updateScheduleForm.value).subscribe(resp => {
      this.getSchedule();
    });
    this.modalService.dismissAll();
  }

  deleteSchedule(data: any) {
    this.scheduleService.deleteSchedule(data.id, data).subscribe(resp => {
      this.getSchedule();
    })
  }

  logout() {
    this.authService.logOut()
  }

}
