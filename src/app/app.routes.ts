import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authRoutes } from './features/auth/auth.routes';

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
    children: [
      // { path: 'corridas', children: corridasRoutes },
      // { path: 'usuarios', children: usuariosRoutes },
    ]
  },

  // Rota coringa: qualquer rota não reconhecida
  { path: '**', redirectTo: 'auth/login' }
];
