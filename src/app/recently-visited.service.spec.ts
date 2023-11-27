import { TestBed } from '@angular/core/testing';

import { RecentlyVisitedService } from './recently-visited.service';

describe('RecentlyVisitedService', () => {
  let service: RecentlyVisitedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentlyVisitedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
