import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Sessao, UsuarioLogado } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly sessao = signal<Sessao | null>(this.lerSessao());
  readonly estaLogado = computed(() => this.sessao() !== null);
  readonly ehAdmin = computed(() => this.sessao()?.perfil === 'ADMINISTRADOR');

  private lerSessao(): Sessao | null {
    try {
      const valor = localStorage.getItem('sessao');
      if (!valor) return null;
      const sessao = JSON.parse(valor) as Sessao;
      return typeof sessao.username === 'string' && typeof sessao.token === 'string'
        && (sessao.perfil === 'ADMINISTRADOR' || sessao.perfil === 'LEITOR') ? sessao : null;
    } catch {
      return null;
    }
  }


  login(usuario: string, senha: string): Observable<Sessao> {
    const token = btoa(`${usuario}:${senha}`);
    const headers = new HttpHeaders({ Authorization: `Basic ${token}` });
    return this.http.get<UsuarioLogado>('http://localhost:8080/api/auth/me', { headers }).pipe(
      map((resposta) => ({ ...resposta, token })),
      tap((sessao) => {
        localStorage.setItem('sessao', JSON.stringify(sessao));
        this.sessao.set(sessao);
      }),
    );
  }

  sair(): void {
    localStorage.removeItem('sessao');
    this.sessao.set(null);
  }
}