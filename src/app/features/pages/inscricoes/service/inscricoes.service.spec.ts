import { TestBed } from '@angular/core/testing';

import { InscricoesService } from './inscricoes.service';

describe('InscricoesService', () => {
  let service: InscricoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscricoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
