import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../../core/services/auth.service';

export class SenhaDiferenteMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidControl = !!(control && control.invalid && control.touched);
    const invalidGroup = !!(control && control.parent && control.parent.errors?.['senhaDiferente'] && control.touched);
    return invalidControl || invalidGroup;
  }
}

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {

  senhaMatcher = new SenhaDiferenteMatcher();

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmacaoSenha: ['', Validators.required]
    }, { validators: [this.confirmacaoSenhaValidator] });
  }

  confirmacaoSenhaValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const senha = group.get('senha')?.value;
    const confirmacao = group.get('confirmacaoSenha')?.value;
    if (!senha || !confirmacao) return null;
    return senha !== confirmacao ? { senhaDiferente: true } : null;
  };

  async onSubmit() {
    this.toastr.clear();
    if (this.registroForm.valid) {
      const { nome, email, senha } = this.registroForm.value;
      this.ngxUiLoaderService.start();

      this.authService.registrar({ nome, email, senha }).subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success('Registro realizado com sucesso!', 'Bem-vindo');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error(err.error?.mensagem || 'Erro ao registrar usuário. Tente novamente mais tarde.', 'Erro ao registrar');
          console.error('Erro ao registrar:', err);
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }
  }

}
