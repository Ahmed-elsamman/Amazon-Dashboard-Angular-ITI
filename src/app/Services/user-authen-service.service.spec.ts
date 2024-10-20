import { TestBed } from '@angular/core/testing';

import { UserAuthenServiceService } from './user-authen-service.service';

describe('UserAuthenServiceService', () => {
  let service: UserAuthenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAuthenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
