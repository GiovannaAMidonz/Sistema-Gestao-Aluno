import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { NotificacaoService } from '../../services/notificacao';
import { NovoAlunoRequest } from '../../models/aluno';
import { TemAlteracoesNaoSalvas } from '../../guards/alteracoes-nao-salvas.guard';
import {
  cpfValidator,
  mascaraCpf,
  mascaraTelefone,
  nomeCompletoValidator,
  somenteDigitos,
  telefoneValidator,
  validarArquivoFoto,
} from '../../validators/aluno-validators';

type CampoForm = 'nomeCompleto' | 'email' | 'cpf' | 'telefone';











@Component({
  selector: 'app-novo-aluno',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './novo-aluno.html',
  styleUrl: './novo-aluno.css',
  host: {

    '(window:beforeunload)': 'aoFecharJanela($event)',
  },
})
export class NovoAlunoComponent implements TemAlteracoesNaoSalvas {
  private readonly alunoService = inject(AlunoService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly salvando = signal(false);
  readonly erroGeral = signal<string | null>(null);


  readonly fotoPreview = signal<string | null>(null);
  readonly fotoNome = signal<string | null>(null);
  readonly fotoErro = signal<string | null>(null);


  private cadastroConcluido = false;





  readonly form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, nomeCompletoValidator()]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    cpf: ['', [Validators.required, cpfValidator()]],
    telefone: ['', [Validators.required, telefoneValidator()]],
  });



  campoInvalido(campo: CampoForm): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }


  mensagemErro(campo: CampoForm): string {
    const erros = this.form.controls[campo].errors;
    if (!erros) {
      return '';
    }
    if (erros['servidor']) {
      return erros['servidor'];
    }
    if (erros['required']) {
      return 'Campo obrigatório.';
    }

    switch (campo) {
      case 'nomeCompleto':
        return erros['nomeTamanho']
          ? 'O nome deve ter entre 3 e 120 caracteres.'
          : 'Use apenas letras, espaços, hífen (-) e apóstrofo (\').';
      case 'email':
        return 'Informe um e-mail válido. Ex.: nome@email.com';
      case 'cpf':
        return 'CPF inválido.';
      case 'telefone':
        return 'Informe DDD + número. Ex.: (11) 99999-9999';
    }
  }



  aoDigitarCpf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.form.controls.cpf.setValue(mascaraCpf(input.value));
  }

  aoDigitarTelefone(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.form.controls.telefone.setValue(mascaraTelefone(input.value));
  }



  aoSelecionarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    this.fotoErro.set(null);

    if (!arquivo) {
      return;
    }

    const mensagem = validarArquivoFoto(arquivo);
    if (mensagem) {
      this.fotoErro.set(mensagem);
      return;
    }


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



  cadastrar(): void {

    if (this.form.invalid || this.salvando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroGeral.set(null);

    const v = this.form.getRawValue();
    const dados: NovoAlunoRequest = {
      nomeCompleto: v.nomeCompleto.trim().replace(/\s+/g, ' '),
      email: v.email.trim().toLowerCase(),
      cpf: somenteDigitos(v.cpf),
      telefone: somenteDigitos(v.telefone),
      fotoUrl: this.fotoPreview(),
      status: 'ATIVO',
    };

    this.alunoService.criar(dados).subscribe({
      next: (aluno) => {

        this.cadastroConcluido = true;
        this.notificacao.sucesso(
          `Aluno ${aluno.nomeCompleto} cadastrado com sucesso! Matrícula: ${aluno.matricula}`,
        );
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

    const corpo = erro.error ?? {};
    const errosPorCampo = this.extrairErrosPorCampo(corpo);
    let algumCampoMarcado = false;

    for (const [campo, mensagem] of Object.entries(errosPorCampo)) {
      if (campo in this.form.controls) {
        const controle = this.form.controls[campo as CampoForm];
        controle.setErrors({ ...controle.errors, servidor: mensagem });
        controle.markAsTouched();
        algumCampoMarcado = true;
      }
    }

    const mensagem: string = corpo.mensagem ?? corpo.message ?? corpo.detail ?? '';


    if (erro.status === 409 && !algumCampoMarcado) {
      const campo: CampoForm | null = /cpf/i.test(mensagem) ? 'cpf' : /e-?mail/i.test(mensagem) ? 'email' : null;
      if (campo) {
        const controle = this.form.controls[campo];
        controle.setErrors({ servidor: campo === 'cpf' ? 'CPF já cadastrado.' : 'E-mail já cadastrado.' });
        controle.markAsTouched();
        algumCampoMarcado = true;
      }
    }

    if (erro.status === 413) {
      this.fotoErro.set('A foto é grande demais para o servidor.');
    }

    this.erroGeral.set(
      algumCampoMarcado
        ? 'Corrija os campos destacados. Seus dados foram mantidos.'
        : mensagem || 'Não foi possível cadastrar o aluno. Seus dados foram mantidos, tente novamente.',
    );
  }


  private extrairErrosPorCampo(corpo: any): Record<string, string> {
    const resultado: Record<string, string> = {};

    for (const fonte of [corpo.erros, corpo.errors, corpo.fieldErrors, corpo.campos]) {
      if (Array.isArray(fonte)) {
        for (const item of fonte) {
          const campo = item?.field ?? item?.campo;
          const msg = item?.defaultMessage ?? item?.message ?? item?.mensagem;
          if (campo && msg) {
            resultado[campo] = msg;
          }
        }
      } else if (fonte && typeof fonte === 'object') {
        for (const [campo, msg] of Object.entries(fonte)) {
          if (typeof msg === 'string') {
            resultado[campo] = msg;
          }
        }
      }
    }
    return resultado;
  }



  private temAlteracoes(): boolean {
    return !this.cadastroConcluido && (this.form.dirty || this.fotoPreview() !== null);
  }


  podeSair(): boolean {
    return !this.temAlteracoes() || confirm('Existem alterações não salvas. Deseja realmente sair?');
  }


  aoFecharJanela(evento: BeforeUnloadEvent): void {
    if (this.temAlteracoes()) {
      evento.preventDefault();
    }
  }
}
