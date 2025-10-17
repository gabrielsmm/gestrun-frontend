import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Perfil } from '../../../core/models/perfil.enum';
import { Usuario } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';

interface ItemPainel {
  titulo: string;
  descricao: string;
  icone: string;
  rota: string;
  perfisPermitidos: Perfil[];
}

@Component({
  selector: 'app-painel-principal',
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './painel-principal.html',
  styleUrl: './painel-principal.scss',
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class PainelPrincipal {

  private authService = inject(AuthService);
  private router = inject(Router);

  usuario: Usuario | null = null;

  itensPainel: ItemPainel[] = [
    {
      titulo: 'Usuários',
      descricao: 'Gerencie os usuários do sistema',
      icone: 'group',
      rota: '/usuarios',
      perfisPermitidos: [Perfil.ADMIN]
    },
    {
      titulo: 'Corridas',
      descricao: 'Visualize e gerencie as corridas',
      icone: 'directions_run',
      rota: '/corridas',
      perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR]
    },
    {
      titulo: 'Categorias',
      descricao: 'Defina categorias das corridas',
      icone: 'category',
      rota: '/categorias',
      perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR]
    },
    {
      titulo: 'Inscrições',
      descricao: 'Gerencie inscrições dos participantes',
      icone: 'assignment',
      rota: '/inscricoes',
      perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR]
    },
    {
      titulo: 'Resultados',
      descricao: 'Acompanhe os resultados das corridas',
      icone: 'emoji_events',
      rota: '/resultados',
      perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR]
    },
    {
      titulo: 'Relatórios',
      descricao: 'Gere relatórios detalhados',
      icone: 'bar_chart',
      rota: '/relatorios',
      perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR]
    }
  ];

  constructor() {
    this.authService.usuarioLogado$.subscribe(user => {
      this.usuario = user;
    });
  }

  podeAcessar(item: ItemPainel): boolean {
    return !!this.usuario && item.perfisPermitidos.includes(this.usuario.perfil);
  }

  navegar(rota: string): void {
    this.router.navigate([rota]);
  }

}
