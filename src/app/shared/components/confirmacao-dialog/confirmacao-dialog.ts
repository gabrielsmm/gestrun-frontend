import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmacaoDialogData {
  titulo: string;
  mensagem: string;
  confirmarTexto?: string;
  cancelarTexto?: string;
}

@Component({
  selector: 'app-confirmacao-dialog',
  imports: [
    MatButtonModule
  ],
  templateUrl: './confirmacao-dialog.html',
  styleUrl: './confirmacao-dialog.scss'
})
export class ConfirmacaoDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmacaoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogData
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

}
