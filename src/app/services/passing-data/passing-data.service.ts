import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassingdataService {
  
  constructor() { }

  private data: any;

  setData(data: any) {
    this.data = data;
  }
  getData() {
    let temp = this.data;
    this.clearData();
    return temp;
  }

  clearData() {
    this.data = undefined
  }

}
