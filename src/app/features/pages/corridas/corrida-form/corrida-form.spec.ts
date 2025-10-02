import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridaForm } from './corrida-form';

describe('CorridaForm', () => {
  let component: CorridaForm;
  let fixture: ComponentFixture<CorridaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorridaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
