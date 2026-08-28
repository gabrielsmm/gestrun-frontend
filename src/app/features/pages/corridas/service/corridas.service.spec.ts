import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CorridasService } from './corridas.service';

describe('CorridasService', () => {
  let service: CorridasService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CorridasService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('altera a publicação da corrida pelo endpoint específico', () => {
    service.alterarPublicacao(12, true).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/corridas/12/publicacao');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ publicada: true });
    request.flush({});
  });
});
