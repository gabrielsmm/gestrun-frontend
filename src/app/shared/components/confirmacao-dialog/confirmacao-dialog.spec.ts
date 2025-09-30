import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoDialog } from './confirmacao-dialog';

describe('ConfirmacaoDialog', () => {
  let component: ConfirmacaoDialog;
  let fixture: ComponentFixture<ConfirmacaoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacaoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacaoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
