import { Routes } from '@angular/router';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { AlunoFormComponent } from './pages/aluno-form/aluno-form.component';
import { AlunoDetalhesComponent } from './pages/aluno-detalhes/aluno-detalhes.component';
import { NovoAlunoComponent } from './pages/novo-aluno/novo-aluno.component';
import { alteracoesNaoSalvasGuard } from './guards/alteracoes-nao-salvas.guard';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { AlunosExcluidosComponent } from './pages/alunos-excluidos/alunos-excluidos.component';

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
      { path: 'alunos/excluidos',
        component: AlunosExcluidosComponent,
        title: 'Alunos Excluídos'
        },


      { path: 'alunos/:id',
         component: AlunoDetalhesComponent, 
         title: 'Detalhes do Aluno' 
        },

      { path: 'alunos/:id/editar',
         component: AlunoFormComponent,
          title: 'Editar Aluno', 
          canDeactivate: [alteracoesNaoSalvasGuard]
         },

         
    ],
  },
  { path: '**', redirectTo: '' },
];
