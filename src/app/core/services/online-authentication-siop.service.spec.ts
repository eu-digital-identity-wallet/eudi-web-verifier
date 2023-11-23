import { TestBed } from '@angular/core/testing';

import { OnlineAuthenticationSIOPService } from './online-authentication-siop.service';

describe('OnlineAuthenticationSIOPService', () => {
  let service: OnlineAuthenticationSIOPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineAuthenticationSIOPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
