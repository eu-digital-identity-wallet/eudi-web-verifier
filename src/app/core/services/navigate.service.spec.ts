import { TestBed } from '@angular/core/testing';

import { NavigateService } from './navigate.service';

describe('NavigateService', () => {
  let service: NavigateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
