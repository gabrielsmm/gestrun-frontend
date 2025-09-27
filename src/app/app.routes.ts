import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authRoutes } from './features/auth/auth.routes';
import { PainelPrincipal } from './features/pages/painel-principal/painel-principal';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Rota em branco redireciona para login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Rotas de autenticação
  {
    path: 'auth',
    component: AuthLayout,
    children: authRoutes
  },

  // Outras rotas
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'painel-principal', pathMatch: 'full' },
      { path: 'painel-principal', component: PainelPrincipal }

      // Páginas principais do sistema
      // { path: 'corridas', component: CorridasPage },
      // { path: 'usuarios', component: UsuariosPage },
      // { path: 'resultados', component: ResultadosPage },
      // { path: 'relatorios', component: RelatoriosPage },
    ]
  },

  // Rota coringa: qualquer rota não reconhecida
  { path: '**', redirectTo: 'auth/login' }
];
