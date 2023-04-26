import { TestBed } from '@angular/core/testing';

import { PresentationDefinitionService } from './presentation-definition.service';

describe('PresentationDefinitionService', () => {
  let service: PresentationDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresentationDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
