import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  const qrData = {
    "transaction_id": "AhF1PtlSCxN7sAMMTQPyAiBjgeVNj6vXC-xXtkH8Ai6gJfdDtUPXewN2Kc1p5EKNnQzR2i6FMKvH7qPH_mxnxA",
    "client_id": "Verifier",
    "request_uri": "http://localhost:8080/wallet/request.jwt/aR9QaOQsY2Dhqcw4W30IL8O0s-zQlrkVQZbnQ52KS2Al5Po13elkVZJTo3GKcQn8gxFnYnUA18I8YXG7WhSZ_Q"
  }
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
