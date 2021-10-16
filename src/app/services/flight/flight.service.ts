import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Airline } from '../../model/airline.model';
import { Coupon } from '../../model/coupon.model';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = environment.baseUrl;
  token: any;
  username: any;
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  searchFlight(from: string, to: string, depatureDate: string, returnDate: string): Observable<Object> {
    let params = new HttpParams();
    params = params.append('origin', from);
    params = params.append('destination', to);
    params = params.append('depature', depatureDate);
    params = params.append('return', returnDate);
    return this.http.get(`${this.baseUrl}/search`, { params: params });
  }

  saveTravellerDetails(traveller: any) {
    this.username = this.authService.getData('username');
    let params = new HttpParams();
    params = params.append('username', this.username);
    return this.http.post(`${this.baseUrl}/traveller?${params}`, traveller[0]);
  }

  confirmBookingDetails(booking:any){
    this.username = this.authService.getData('username');
    let params = new HttpParams();
    params = params.append('username', this.username);
    return this.http.post(`${this.baseUrl}/booking/flight?${params}`, booking);
  }

  getBookingHistory(){
    this.username = this.authService.getData('username');
    let params = new HttpParams();
    params = params.append('username', this.username);
    return this.http.get(`${this.baseUrl}/booking/history`, { params: params });
  }

  checkDate(date:any){
    let params = new HttpParams();
    params = params.append('depatureDate', date);
    return this.http.get(`${this.baseUrl}/check/cancel`, { params: params });

  }

  cancelBookedFlight(pnrNumber:string){
    return this.http.get(`${this.baseUrl}/booking/cancel/${pnrNumber}`);
  }

  getFlightCoupon() {
    return this.http.get<Coupon>(`http://ec2-3-15-182-227.us-east-2.compute.amazonaws.com:8762/api/admin/list`);
  }

  saveAirlineDetails(airlineDetails: Airline) {
    let header = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + this.authService.getData("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    this.token = this.authService.getData('authToken');
    console.log(airlineDetails);
    return this.http.post(`${this.baseUrl}`, airlineDetails, { headers: header });
  }

  getAirline() {
    let header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.getData("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Airline>(`${this.baseUrl}/airline/getAll`, { headers: header });
  }

  updateAirline(id: any, data: Airline) {
    let header = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + this.authService.getData("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.baseUrl}/${id}`, data, { headers: header });
  }

  getAirlineWithParams(airlineName: string) {
    let header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.getData("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Airline>(`${this.baseUrl}/${airlineName}`, { headers: header });
  }

}
