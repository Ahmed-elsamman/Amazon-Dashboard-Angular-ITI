import { TestBed } from '@angular/core/testing';

import { FirebasePrdService } from './fire-base-prd.service';

describe('FireBasePrdService', () => {
  let service: FirebasePrdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebasePrdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
