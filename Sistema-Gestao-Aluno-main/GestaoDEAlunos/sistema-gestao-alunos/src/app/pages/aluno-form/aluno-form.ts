import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Aluno, AtualizarAlunoRequest, StatusAluno } from '../../models/aluno';
import { TemAlteracoesNaoSalvas } from '../../guards/alteracoes-nao-salvas.guard';
import { AlunoService } from '../../services/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { mascaraCpf, mascaraTelefone, nomeCompletoValidator, somenteDigitos, telefoneValidator, validarArquivoFoto } from '../../validators/aluno-validators';

type CampoForm = 'nomeCompleto' | 'email' | 'telefone' | 'status';


@Component({
  selector: 'app-aluno-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-form.html',
  styleUrls: ['../novo-aluno/novo-aluno.css', './aluno-form.css'],
  host: { '(window:beforeunload)': 'aoFecharJanela($event)' },
})
export class AlunoFormComponent implements OnInit, TemAlteracoesNaoSalvas {
  private readonly alunoService = inject(AlunoService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly aluno = signal<Aluno | null>(null);
  readonly carregando = signal(true);
  readonly erroCarregamento = signal<string | null>(null);
  readonly salvando = signal(false);
  readonly erroGeral = signal<string | null>(null);
  readonly fotoPreview = signal<string | null>(null);
  readonly fotoNome = signal<string | null>(null);
  readonly fotoErro = signal<string | null>(null);
  private valoresOriginais: AtualizarAlunoRequest | null = null;
  private salvoComSucesso = false;


  readonly form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, nomeCompletoValidator()]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefone: ['', [Validators.required, telefoneValidator()]],
    status: ['ATIVO' as StatusAluno, Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.alunoService.buscarPorId(id).subscribe({
      next: (aluno) => {
        this.aluno.set(aluno);
        this.fotoPreview.set(aluno.fotoUrl);
        this.form.setValue({ nomeCompleto: aluno.nomeCompleto, email: aluno.email,
          telefone: mascaraTelefone(aluno.telefone), status: aluno.status });

        this.valoresOriginais = this.montarDados();
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        this.erroCarregamento.set(erro.status === 404
          ? 'Aluno não encontrado. Ele pode ter sido excluído.'
          : 'Não foi possível carregar os dados do aluno. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  cpfFormatado(): string { return mascaraCpf(this.aluno()?.cpf ?? ''); }

  campoInvalido(campo: CampoForm): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  mensagemErro(campo: CampoForm): string {
    const erros = this.form.controls[campo].errors;
    if (!erros) return '';
    if (erros['servidor']) return erros['servidor'];
    if (erros['required']) return 'Campo obrigatório.';
    switch (campo) {
      case 'nomeCompleto': return erros['nomeTamanho']
        ? 'O nome deve ter entre 3 e 120 caracteres.'
        : 'Use apenas letras, espaços, hífen (-) e apóstrofo (\').';
      case 'email': return 'Informe um e-mail válido. Ex.: nome@email.com';
      case 'telefone': return 'Informe DDD + número. Ex.: (11) 99999-9999';
      case 'status': return 'Escolha um status.';
    }
  }

  aoDigitarTelefone(evento: Event): void {
    this.form.controls.telefone.setValue(mascaraTelefone((evento.target as HTMLInputElement).value));
  }

  aoSelecionarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    this.fotoErro.set(null);
    if (!arquivo) return;
    const mensagem = validarArquivoFoto(arquivo);
    if (mensagem) { this.fotoErro.set(mensagem); return; }
    const leitor = new FileReader();
    leitor.onload = () => {
      this.fotoPreview.set(leitor.result as string);
      this.fotoNome.set(arquivo.name);
    };
    leitor.onerror = () => this.fotoErro.set('Não foi possível ler o arquivo.');
    leitor.readAsDataURL(arquivo);
  }

  removerFoto(): void {
    this.fotoPreview.set(null);
    this.fotoNome.set(null);
    this.fotoErro.set(null);
  }


  montarDados(): AtualizarAlunoRequest {
    const valores = this.form.getRawValue();
    return {
      nomeCompleto: valores.nomeCompleto.trim().replace(/\s+/g, ' '),
      email: valores.email.trim().toLowerCase(),
      telefone: somenteDigitos(valores.telefone),
      fotoUrl: this.fotoPreview(), status: valores.status,
    };
  }


  temAlteracoes(): boolean {
    if (!this.valoresOriginais) return false;
    const atual = this.montarDados();
    return atual.nomeCompleto !== this.valoresOriginais.nomeCompleto
      || atual.email !== this.valoresOriginais.email
      || atual.telefone !== this.valoresOriginais.telefone
      || atual.fotoUrl !== this.valoresOriginais.fotoUrl
      || atual.status !== this.valoresOriginais.status;
  }

  podeSalvar(): boolean { return this.temAlteracoes() && this.form.valid && !this.salvando(); }

  salvar(): void {
    if (!this.podeSalvar()) { this.form.markAllAsTouched(); return; }
    const aluno = this.aluno();
    if (!aluno) return;
    this.salvando.set(true);
    this.erroGeral.set(null);
    const dados = this.montarDados();
    this.alunoService.atualizar(aluno.id, dados).subscribe({
      next: () => {
        this.salvoComSucesso = true;
        this.notificacao.sucesso(`Dados do aluno ${dados.nomeCompleto} atualizados com sucesso!`);
        this.router.navigate(['/']);
      },
      error: (erro: HttpErrorResponse) => {

        this.salvando.set(false);
        this.tratarErroServidor(erro);
      },
    });
  }

  private tratarErroServidor(erro: HttpErrorResponse): void {
    if (erro.status === 0) {
      this.erroGeral.set('Não foi possível conectar ao servidor. Seus dados foram mantidos, tente novamente.');
      return;
    }
    if (erro.status === 404) {
      this.erroGeral.set('Este aluno não existe mais. Seus dados foram mantidos.');
      return;
    }
    if (erro.status === 409) {
      const controle = this.form.controls.email;
      controle.setErrors({ ...controle.errors, servidor: 'Este e-mail já está cadastrado para outro aluno.' });
      controle.markAsTouched();
    } else if (erro.status === 422) {
      const campos = erro.error?.campos ?? {};
      for (const [campo, mensagem] of Object.entries(campos)) {
        if (campo in this.form.controls && typeof mensagem === 'string') {
          const controle = this.form.controls[campo as CampoForm];
          controle.setErrors({ ...controle.errors, servidor: mensagem });
          controle.markAsTouched();
        }
      }
    }
    this.erroGeral.set(erro.status === 409 || erro.status === 422
      ? 'Corrija os campos destacados. Seus dados foram mantidos.'
      : 'Não foi possível salvar o aluno. Seus dados foram mantidos, tente novamente.');
  }


  podeSair(): boolean {
    return this.salvoComSucesso || !this.temAlteracoes()
      || confirm('Existem alterações não salvas. Deseja realmente sair?');
  }

  aoFecharJanela(evento: BeforeUnloadEvent): void {
    if (!this.salvoComSucesso && this.temAlteracoes()) evento.preventDefault();
  }
}