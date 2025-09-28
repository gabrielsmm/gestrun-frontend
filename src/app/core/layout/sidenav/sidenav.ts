import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Perfil } from '../../models/perfil.enum';
import { AuthService } from './../../services/auth.service';

interface NavItem {
  descricao: string;
  icone: string;
  rota: string;
  perfisPermitidos: Perfil[];
}

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

  @Input() opened = true;

  protected authService = inject(AuthService);

  navItems: NavItem[] = [
    { descricao: 'Início', icone: 'home', rota: '/painel-principal', perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR] },
    { descricao: 'Usuários', icone: 'people', rota: '/usuarios', perfisPermitidos: [Perfil.ADMIN] },
    { descricao: 'Corridas', icone: 'directions_run', rota: '/corridas', perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR] },
    { descricao: 'Categorias', icone: 'category', rota: '/categorias', perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR] },
    { descricao: 'Inscrições', icone: 'assignment', rota: '/inscricoes', perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR] },
    { descricao: 'Resultados', icone: 'emoji_events', rota: '/resultados', perfisPermitidos: [Perfil.ADMIN, Perfil.ORGANIZADOR] },
  ];

}
