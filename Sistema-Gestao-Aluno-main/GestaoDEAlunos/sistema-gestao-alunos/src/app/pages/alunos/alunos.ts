import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AlunoService } from '../../services/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { Aluno, StatusAluno } from '../../models/aluno';
import { ConfirmarExclusaoComponent } from '../../components/confirmar-exclusao/confirmar-exclusao';
import { AuthService } from '../../services/auth';







@Component({
  selector: 'app-alunos',
  imports: [RouterLink, ConfirmarExclusaoComponent],
  templateUrl: './alunos.html',
  styleUrl: './alunos.css',
})
export class AlunosComponent implements OnInit {
  private readonly alunoService = inject(AlunoService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly ehAdmin = this.auth.ehAdmin;

  private readonly destroyRef = inject(DestroyRef);

  readonly notificacao = inject(NotificacaoService);






  readonly alunos = signal<Aluno[]>([]);
  readonly paginaAtual = signal(0);
  readonly totalPaginas = signal(0);
  readonly total = signal(0);
  readonly tamanhoPagina = 10;

  readonly busca = signal('');
  readonly status = signal<StatusAluno | ''>('');

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly alunoParaExcluir = signal<Aluno | null>(null);
  readonly excluindo = signal(false);
  readonly erroExclusao = signal<string | null>(null);






  readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, indice) => indice),
  );

  readonly ehPrimeiraPagina = computed(() => this.paginaAtual() === 0);
  readonly ehUltimaPagina = computed(
    () => this.totalPaginas() === 0 || this.paginaAtual() >= this.totalPaginas() - 1,
  );






  private readonly buscaDigitada = new Subject<string>();

  ngOnInit(): void {
    this.buscaDigitada
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((termo) => {
        this.busca.set(termo);
        this.paginaAtual.set(0);
        this.carregarAlunos();
      });


    this.carregarAlunos();
  }


  carregarAlunos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.alunoService
      .listar({
        busca: this.busca(),
        status: this.status(),
        pagina: this.paginaAtual(),
        tamanho: this.tamanhoPagina,
        ordenarPor: 'nomeCompleto',
        direcao: 'asc',
      })
      .subscribe({

        next: (response) => {

          this.alunos.set(response.conteudo);
          this.paginaAtual.set(response.paginaAtual);
          this.totalPaginas.set(response.totalPaginas);
          this.total.set(response.total);
          this.carregando.set(false);
        },

        error: (erro) => {
          console.error('Erro ao carregar alunos', erro);
          this.erro.set('Não foi possível carregar os alunos. Verifique se o backend está rodando.');
          this.alunos.set([]);
          this.carregando.set(false);
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
    this.carregarAlunos();
  }

  irParaPagina(pagina: number): void {

    if (pagina < 0 || pagina >= this.totalPaginas() || pagina === this.paginaAtual()) {
      return;
    }
    this.paginaAtual.set(pagina);
    this.carregarAlunos();
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual() + 1);
  }


  abrirExclusao(aluno: Aluno): void {
    this.erroExclusao.set(null);
    this.alunoParaExcluir.set(aluno);
  }

  cancelarExclusao(): void {
    if (this.excluindo()) return;
    this.alunoParaExcluir.set(null);
    this.erroExclusao.set(null);
  }

  confirmarExclusao(): void {
    const aluno = this.alunoParaExcluir();
    if (!aluno || this.excluindo()) return;
    this.excluindo.set(true);
    this.erroExclusao.set(null);
    this.alunoService.excluir(aluno.id).subscribe({
      next: () => {

        this.excluindo.set(false);
        this.alunoParaExcluir.set(null);
        this.notificacao.sucesso(`Aluno ${aluno.nomeCompleto} (matrícula ${aluno.matricula}) excluído com sucesso.`);
        if (this.alunos().length === 1 && this.paginaAtual() > 0) {
          this.paginaAtual.update((p) => p - 1);
        }
        this.carregarAlunos();
      },
      error: () => {
        this.excluindo.set(false);
        this.erroExclusao.set('Não foi possível excluir o aluno. Tente novamente.');
      },
    });
  }


  sair(): void {
    this.auth.sair();
    this.notificacao.limpar();
    this.router.navigate(['/login']);
  }


  statusLabel(status: StatusAluno): string {
    return status === 'ATIVO' ? 'Ativo' : 'Inativo';
  }
}
