import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coupon } from '../../model/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private baseUrl = 'http://localhost:8762/api/admin/coupon';
  constructor(private http: HttpClient) { }

  savecouponDetails(couponDetails: Coupon) {
    let header = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + sessionStorage.getItem("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.baseUrl}`, couponDetails, { headers: header });
  }

  getCoupon() {
    let header = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + sessionStorage.getItem("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<Coupon>(`${this.baseUrl}`, { headers: header });
  }

  updateCoupon(id: any, data: Coupon) {
    let header = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + sessionStorage.getItem("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.baseUrl}/${id}`, data, { headers: header });
  }

  deleteCoupon(id: any) {
    let header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + sessionStorage.getItem("authToken") || '')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: header });
  }

}
