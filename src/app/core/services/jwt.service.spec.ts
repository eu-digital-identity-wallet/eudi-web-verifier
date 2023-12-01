import { TestBed } from '@angular/core/testing';

import { JWTService } from './jwt.service';
import { KeyValue } from '@angular/common';

describe('JWTService', () => {
  let service: JWTService;
  const decodedTest: KeyValue<string, string>[] = [
    { key: 'sub', value: '1234567890' },
    { key: 'name', value: 'John Doe' },
    { key: 'iat', value: '1516239022' }
  ];
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [JWTService] });
    service = TestBed.inject(JWTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be decoded as a JWT token', (done: DoneFn) => {
    let result: KeyValue<string, string>[] = [];
    service.decode(token).subscribe((decodedData) =>{
      result = decodedData;
      done();
    });
    expect(result).toEqual(decodedTest);
  });

});
