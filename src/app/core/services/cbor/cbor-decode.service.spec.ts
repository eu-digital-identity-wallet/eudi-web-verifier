import { TestBed } from '@angular/core/testing';

import { CborDecodeService } from './cbor-decode.service';

describe('CborDecodeService', () => {
  let service: CborDecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CborDecodeService
      ]
    });
    service = TestBed.inject(CborDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be decode an CBOR token and return a KeyValue array', () => { });
  it('should be decode an CBOR Uint8Array and return a Observable value', () => { });
});
