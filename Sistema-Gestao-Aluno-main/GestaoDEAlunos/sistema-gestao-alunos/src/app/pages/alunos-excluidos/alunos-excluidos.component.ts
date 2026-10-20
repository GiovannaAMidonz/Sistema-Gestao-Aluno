import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnInit, inject, signal } from '@angular/core';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno';

@Component({
  imports: [RouterModule],
  selector: 'app-alunos-excluidos',
  styleUrls: ['./alunos-excluidos.component.css'],
  templateUrl: './alunos-excluidos.component.html',
})
export class AlunosExcluidosComponent implements OnInit {

  private readonly alunoService = inject(AlunoService);
  readonly alunos = signal<Aluno[]>([]);
  ngOnInit(): void {
    this.carregarAlunosExcluidos();
  }

  private carregarAlunosExcluidos(): void {

    this.alunoService
    .listarExcluidos()
    .subscribe({
      next: (response) => {
        console.log('Alunos excluídos carregados com sucesso', response.conteudo);
        this.alunos.set(response.conteudo);
      },
      error: (err) => {
        console.error('Erro ao carregar alunos excluídos', err);
      },
    });
  }
}
