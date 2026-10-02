import { Routes } from '@angular/router';
import { AlunosComponent } from './pages/alunos/alunos';
import { AlunoFormComponent } from './pages/aluno-form/aluno-form';
import { AlunoDetalhesComponent } from './pages/aluno-detalhes/aluno-detalhes';
import { NovoAlunoComponent } from './pages/novo-aluno/novo-aluno';
import { alteracoesNaoSalvasGuard } from './guards/alteracoes-nao-salvas.guard';
import { LoginComponent } from './pages/login/login';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [loginGuard] },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', component: AlunosComponent, title: 'Alunos' },
      {
        path: 'alunos/novo',
        component: NovoAlunoComponent,
        title: 'Novo Aluno',
        canDeactivate: [alteracoesNaoSalvasGuard],
      },
      { path: 'alunos/:id', component: AlunoDetalhesComponent, title: 'Detalhes do Aluno' },
      { path: 'alunos/:id/editar', component: AlunoFormComponent, title: 'Editar Aluno', canDeactivate: [alteracoesNaoSalvasGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
