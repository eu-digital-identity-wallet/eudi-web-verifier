import { TestBed } from '@angular/core/testing';

import { SelectableFormNextAction } from './selectable-form-next-action.service';

describe('HelperCborSelectableService', () => {
  let service: SelectableFormNextAction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectableFormNextAction]
    });
    service = TestBed.inject(SelectableFormNextAction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
