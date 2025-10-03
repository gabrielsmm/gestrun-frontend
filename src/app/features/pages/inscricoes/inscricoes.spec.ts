import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inscricoes } from './inscricoes';

describe('Inscricoes', () => {
  let component: Inscricoes;
  let fixture: ComponentFixture<Inscricoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscricoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inscricoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
