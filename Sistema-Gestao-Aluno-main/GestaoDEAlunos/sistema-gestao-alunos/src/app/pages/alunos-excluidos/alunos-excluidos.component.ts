import { Component,computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnInit, inject, signal } from '@angular/core';
import { StatusAluno } from '../../models/aluno';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterModule, DatePipe],
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

  

  readonly paginaAtual = signal(0);
  readonly totalPaginas = signal(0);
  readonly total = signal(0);
  readonly alunoParaRestaurar = signal<Aluno | null>(null);

  private readonly buscaDigitada = new Subject<string>();
 readonly ehPrimeiraPagina = computed(() => this.paginaAtual() === 0);
  readonly ehUltimaPagina = computed(
    () => this.totalPaginas() === 0 || this.paginaAtual() >= this.totalPaginas() - 1,
  );
  readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i));
  ngOnInit(): void {
    this.carregarAlunosExcluidos();
  }

  private carregarAlunosExcluidos(): void {
  this.alunoService
    .listarExcluidos({
      busca: this.busca(),
      pagina: this.paginaAtual(),
      tamanho: 10,
      ordenarPor: 'nomeCompleto',
      direcao: 'asc'
    })
    .subscribe({
      next: (response) => {
        this.alunos.set(response.conteudo);
        this.totalPaginas.set(response.totalPaginas);
        this.paginaAtual.set(response.paginaAtual);
        this.total.set(response.total);
      },
      error: (err) => {
        console.error('Erro ao carregar alunos excluídos', err);
      },
    });
  }

aoDigitarBusca(evento: Event): void {

  const valor =
    (evento.target as HTMLInputElement).value;

  this.busca.set(valor);

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
  
  statusLabel(status: StatusAluno): string {
    return status === 'ATIVO' ? 'Ativo' : 'Inativo';
  }

  restaurarAluno(id: number): void {

  this.alunoService
    .restaurar(id)
    .subscribe({
      next: () => {
        alert('Aluno restaurado com sucesso');
        this.carregarAlunosExcluidos();
      },
      error: (err) => {
        console.error(
          'Erro ao restaurar aluno',
          err
        );
        alert('Erro ao restaurar aluno');
      }

    });

}
 
}
