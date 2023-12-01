import { TestBed } from '@angular/core/testing';

import { HelperCborSelectableService } from './helper-cbor-selectable.service';

describe('HelperCborSelectableService', () => {
  let service: HelperCborSelectableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelperCborSelectableService]
    });
    service = TestBed.inject(HelperCborSelectableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
