import { Injectable } from '@angular/core';
import { User } from '../../model/user.model';
import { Login } from '../../model/login.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private baseUrl = environment.baseUrl;

  userAccount: any;
  user: any;
  response: any;

  constructor(private http: HttpClient, private router: Router) { }

  getData(label:string) {
    return sessionStorage.getItem(label);
  }

  setData(label:string, data:any) {
    sessionStorage.setItem(label, data);
  }

  removeData(label:string) {
    sessionStorage.removeItem(label);
  }

  login(userlogin: Login) {
    console.log(userlogin);
    return this.http.post(`${this.baseUrl}/auth/signin`, userlogin);
  }

  // Checks whether the user is logged in
  isUserLoggedIn(): boolean {
    let user = this.getData('username');
    console.log(user);
    return !(user === null)
  }

  // Removes user session(logout)
  logOut() {
    this.removeData('username');
    this.removeData('authToken');
    this.removeData('tokenType');
    this.router.navigate([""]).then(() => {''
      window.location.reload();
    });
  }


  // Adds a new User
  signUp(user: User) {
    return this.http.post(`${this.baseUrl}/auth/signup`, user);
  }
}
