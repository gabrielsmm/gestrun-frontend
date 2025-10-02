import { TestBed } from '@angular/core/testing';

import { CorridasService } from './corridas.service';

describe('CorridasService', () => {
  let service: CorridasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorridasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
