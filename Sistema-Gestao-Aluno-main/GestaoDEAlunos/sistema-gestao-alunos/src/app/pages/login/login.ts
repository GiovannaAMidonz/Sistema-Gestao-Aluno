import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

type CampoLogin = 'usuario' | 'senha';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly entrando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly mostrarSenha = signal(false);
  readonly sessaoExpirada = this.route.snapshot.queryParamMap.get('motivo') === 'expirada';


  readonly form = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8,}$/)]],
    senha: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,20}$/)]],
  });

  campoInvalido(campo: CampoLogin): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  mensagemErro(campo: CampoLogin): string {
    if (this.form.controls[campo].hasError('required')) return 'Campo obrigatório.';
    return campo === 'usuario'
      ? 'O usuário deve ter no mínimo 8 letras ou números.'
      : 'A senha deve ter de 8 a 20 caracteres, com letras e números.';
  }


  alternarSenha(): void {
    this.mostrarSenha.update((visivel) => !visivel);
  }


  entrar(): void {
    if (this.form.invalid || this.entrando()) {
      this.form.markAllAsTouched();
      return;
    }
    this.entrando.set(true);
    this.erro.set(null);
    const { usuario, senha } = this.form.getRawValue();
    this.auth.login(usuario, senha).subscribe({
      next: () => this.router.navigate(['/']),
      error: (falha: HttpErrorResponse) => {
        this.erro.set(falha.status === 401 ? 'Usuário ou senha inválidos.'
          : falha.status === 0 ? 'Não foi possível conectar ao servidor. Tente novamente.'
          : 'Não foi possível entrar. Tente novamente.');
        this.entrando.set(false);
      },
    });
  }
}