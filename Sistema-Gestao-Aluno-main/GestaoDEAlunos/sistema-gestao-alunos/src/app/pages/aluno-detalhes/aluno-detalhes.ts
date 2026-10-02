import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { Aluno, AtualizarAlunoRequest } from '../../models/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { ConfirmarExclusaoComponent } from '../../components/confirmar-exclusao/confirmar-exclusao';
import { AuthService } from '../../services/auth';





@Component({
  selector: 'app-aluno-detalhes',
  imports: [RouterLink, ConfirmarExclusaoComponent],
  templateUrl: './aluno-detalhes.html',
  styleUrl: './aluno-detalhes.css',
})
export class AlunoDetalhesComponent implements OnInit {
  private readonly alunoService = inject(AlunoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificacao = inject(NotificacaoService);
  readonly ehAdmin = inject(AuthService).ehAdmin;


  readonly aluno = signal<Aluno | null>(null);
  readonly erro = signal<string | null>(null);
  readonly processando = signal(false);

  readonly modalExclusaoAberto = signal(false);
  readonly erroExclusao = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.alunoService.buscarPorId(id).subscribe({
      next: (aluno) => this.aluno.set(aluno),
      error: () => this.erro.set('Aluno não encontrado.'),
    });
  }






  alternarArquivamento(): void {
    const atual = this.aluno();
    if (!atual) {
      return;
    }

    const novoStatus = atual.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const dados: AtualizarAlunoRequest = {
      nomeCompleto: atual.nomeCompleto, email: atual.email, telefone: atual.telefone,
      fotoUrl: atual.fotoUrl, status: novoStatus,
    };

    this.processando.set(true);
    this.alunoService.atualizar(atual.id, dados).subscribe({
      next: (atualizado) => {
        this.aluno.set(atualizado);
        this.processando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível alterar o status do aluno.');
        this.processando.set(false);
      },
    });
  }


  abrirExclusao(): void {
    this.erroExclusao.set(null);
    this.modalExclusaoAberto.set(true);
  }

  cancelarExclusao(): void {
    if (this.processando()) return;
    this.modalExclusaoAberto.set(false);
    this.erroExclusao.set(null);
  }

  confirmarExclusao(): void {
    const atual = this.aluno();
    if (!atual || !this.modalExclusaoAberto() || this.processando()) return;
    this.processando.set(true);
    this.alunoService.excluir(atual.id).subscribe({
      next: () => {
        this.modalExclusaoAberto.set(false);
        this.notificacao.sucesso(`Aluno ${atual.nomeCompleto} (matrícula ${atual.matricula}) excluído com sucesso.`);
        this.router.navigate(['/']);
      },
      error: () => {
        this.erroExclusao.set('Não foi possível excluir o aluno. Tente novamente.');
        this.processando.set(false);
      },
    });
  }


  formatarCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }


  formatarTelefone(tel: string): string {
    return tel.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  }
}
