import { TestBed } from '@angular/core/testing';

import { CborDecodeService } from './cbor-decode.service';

describe('CborDecodeService', () => {
  let service: CborDecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CborDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
