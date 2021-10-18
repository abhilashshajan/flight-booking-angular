import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { FlightSchedule } from '../../model/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = 'http://localhost:8762/api/admin/schedule';
  token:any;
  constructor(private http: HttpClient) { }

  saveScheduleDetails(scheduleDetails:FlightSchedule){
    let header = new HttpHeaders()
    .set('Content-type','application/json')
    .set('Authorization','Bearer '+ sessionStorage.getItem("authToken") ||'')
    .set('Access-Control-Allow-Origin','*');
    this.token = sessionStorage.getItem('authToken');
    console.log(scheduleDetails);
    return this.http.post(`${this.baseUrl}`,scheduleDetails,{headers:header});
  }

  getSchedule(){
    let header = new HttpHeaders()
    .set('Content-type','application/json')
    .set('Authorization','Bearer '+ sessionStorage.getItem("authToken") ||'')
    .set('Access-Control-Allow-Origin','*');
    return this.http.get<FlightSchedule>(`${this.baseUrl}`,{headers:header});
  }

  updateSchedule(id:any, data:FlightSchedule) {
    let header = new HttpHeaders()
    .set('Content-type','application/json')
    .set('Authorization','Bearer '+ sessionStorage.getItem("authToken") ||'')
    .set('Access-Control-Allow-Origin','*');
    this.token = sessionStorage.getItem('authToken');
    return this.http.put(`${this.baseUrl}/${id}`, data,{headers:header});
  }

  deleteSchedule(id:any,data:FlightSchedule) {
    let header = new HttpHeaders()
    .set('Content-type','application/json')
    .set('Authorization','Bearer '+ sessionStorage.getItem("authToken") ||'')
    .set('Access-Control-Allow-Origin','*');
    return this.http.delete(`${this.baseUrl}/${id}`,{headers:header});
  }



}
