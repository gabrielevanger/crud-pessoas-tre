import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
  {
    path: 'pessoas',
    loadComponent: () => import('./components/pessoa-list/pessoa-list').then(m => m.PessoaListComponent)
  },
  {
    path: 'pessoas/novo',
    loadComponent: () => import('./components/pessoa-form/pessoa-form').then(m => m.PessoaFormComponent)
  },
  {
    path: 'pessoas/:cpf/editar',
    loadComponent: () => import('./components/pessoa-form/pessoa-form').then(m => m.PessoaFormComponent)
  },
];
