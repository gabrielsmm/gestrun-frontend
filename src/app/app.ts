import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgxUiLoaderModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.carregarPerfil();
  }

  private carregarPerfil(): void {
    const token = this.authService.getToken();

    if (token && this.authService.estaAutenticado()) {
      this.authService.carregarPerfil().subscribe({
        next: () => {
          // Perfil carregado com sucesso
        },
        error: (err) => {
          console.error('Erro ao carregar o perfil do usuário.', err);
          this.authService.deslogar();
        }
      });
    }
  }

}
