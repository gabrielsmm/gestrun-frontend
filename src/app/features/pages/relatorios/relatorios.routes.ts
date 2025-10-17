import { Routes } from "@angular/router";
import { RelatorioResultados } from "./relatorio-resultados/relatorio-resultados";
import { Relatorios } from "./relatorios";

export const relatoriosRoutes: Routes = [
  {
    path: '',
    component: Relatorios,
    children: [
      { path: 'resultados', component: RelatorioResultados },
      // Futuras rotas: { path: 'corridas', component: CorridasRelatorioComponent }
      { path: '', redirectTo: 'resultados', pathMatch: 'full' }
    ]
  }
];
