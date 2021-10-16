import { TestBed } from '@angular/core/testing';

import { RestcallService } from './restcall.service';

describe('RestcallService', () => {
  let service: RestcallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestcallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
