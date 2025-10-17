import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioResultados } from './relatorio-resultados';

describe('RelatorioResultados', () => {
  let component: RelatorioResultados;
  let fixture: ComponentFixture<RelatorioResultados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioResultados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioResultados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
