import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CouponService } from '../services/coupon/coupon.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponForm: FormGroup;
  updateCouponForm: FormGroup;
  sendData: any;
  couponDetails: any;
  enableEdit = false;
  enableEditIndex = null;
  display: string;
  populateData:any;
  
  constructor(private fb: FormBuilder, private authService: AuthenticationService, private couponService: CouponService, private modalService: NgbModal) {
    this.couponForm = fb.group({
      couponName: ['', Validators.required],
      couponValue: ['', Validators.required]
    });
    this.display = "";  
    this.updateCouponForm = this.fb.group({
      id: [''],
      couponName: [''],
      couponValue: ['']
     }); 
  }

  ngOnInit(): void {
    this.getCoupon();
  }

  saveCoupon(couponForm: any) {
    this.couponService.savecouponDetails(couponForm.value).subscribe(resp => {
      console.log(resp);
      this.getCoupon();
    });
    this.couponForm.reset();
    this.getCoupon();
  }

  getCoupon() {
    this.couponService.getCoupon().subscribe(resp => {
      this.couponDetails = resp;
      console.log(this.couponDetails);
      localStorage.setItem('couponDetails', JSON.stringify(this.couponDetails));
    })
  }

  deleteCoupon(data: any) {
    this.couponService.deleteCoupon(data.id).subscribe(resp => {
      this.getCoupon();
    })
  }

  updateCoupon(updateCouponForm:any) {    
    this.couponService.updateCoupon(updateCouponForm.value.id,updateCouponForm.value).subscribe(resp => {
      this.getCoupon();
      });
      this.modalService.dismissAll();
  }

  openModal(targetModal:any, value:any) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static'
    });   
    this.updateCouponForm.patchValue({
     id:value.id,
     couponName: value.couponName,
     couponValue: value.couponValue
    });
    
  }

  logout(){
    this.authService.logOut();
  }  

}
