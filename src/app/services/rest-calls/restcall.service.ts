import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RestcallService {
  private baseUrl = environment.baseUrl;

  constructor(private authService: AuthenticationService, private http: HttpClient) { }

  get(url:string, responseType:any, options?:any){
    return this.http.get<typeof responseType>(`${this.baseUrl}/${url}`);
  }
  post(url:string, body:any, responseType:any, options?:any){
    return this.http.post<typeof responseType>(`${this.baseUrl}/${url}`, body);
  }
  put(url:string, body:any, responseType:any, options?:any){
    return this.http.put<typeof responseType>(`${this.baseUrl}/${url}`, body);
  }
  delete(url:string, options?:any){
    return this.http.delete(`${this.baseUrl}/${url}`, options);
  }
}
