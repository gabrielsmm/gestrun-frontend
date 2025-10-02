import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Perfil } from '../models/perfil.enum';
import { AuthService } from '../services/auth.service';

export const perfilGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.getUsuarioLogado();
  const perfisPermitidos = route.data?.['perfisPermitidos'] as Perfil[] | undefined;

  if (!usuario || (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil))) {
    router.navigate(['/painel-principal']);
    return false;
  }
  return true;
};
