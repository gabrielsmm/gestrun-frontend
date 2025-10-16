import { AuthService } from './../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;

  senhaVisivel = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    this.toastr.clear();
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      this.ngxUiLoaderService.start();

      this.authService.login({ email, senha }).subscribe({
        next: (res) => {
          this.toastr.success('Login realizado com sucesso!', 'Bem-vindo');
          this.router.navigate(['/painel-principal']);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error(err.error?.mensagem || 'Erro ao realizar login. Tente novamente mais tarde.', 'Erro ao realizar login');
          console.error('Erro ao realizar login:', err);
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }

}
