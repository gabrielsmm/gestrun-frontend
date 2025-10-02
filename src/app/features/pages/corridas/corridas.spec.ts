import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corridas } from './corridas';

describe('Corridas', () => {
  let component: Corridas;
  let fixture: ComponentFixture<Corridas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corridas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Corridas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
