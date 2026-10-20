import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnInit, inject, signal } from '@angular/core';
import { StatusAluno } from '../../models/aluno';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { Subject } from 'rxjs';
@Component({
  imports: [RouterModule],
  selector: 'app-alunos-excluidos',
  styleUrls: ['./alunos-excluidos.component.css'],
  templateUrl: './alunos-excluidos.component.html',
})
export class AlunosExcluidosComponent implements OnInit {

  private readonly alunoService = inject(AlunoService);
 
  readonly alunos = signal<Aluno[]>([]);
  readonly busca = signal('');
  readonly erro = signal<string | null>(null);
  readonly carregando = signal(false);
  readonly notificacao = inject(NotificacaoService);

  readonly status = signal<StatusAluno | ''>('');

  readonly paginaAtual = signal(0);
  readonly totalPaginas = signal(0);

   private readonly buscaDigitada = new Subject<string>();

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

aoDigitarBusca(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.buscaDigitada.next(valor);
  }


  aoMudarStatus(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as StatusAluno | '';
    this.status.set(valor);
    this.paginaAtual.set(0);
    this.carregarAlunosExcluidos();
  }

  irParaPagina(pagina: number): void {

    if (pagina < 0 || pagina >= this.totalPaginas() || pagina === this.paginaAtual()) {
      return;
    }
    this.paginaAtual.set(pagina);
    this.carregarAlunosExcluidos();
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual() + 1);
  }
  
}
