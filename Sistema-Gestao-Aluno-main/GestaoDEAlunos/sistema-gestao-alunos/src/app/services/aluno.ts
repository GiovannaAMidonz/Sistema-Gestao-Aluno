import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AtualizarAlunoRequest, NovoAlunoRequest, StatusAluno } from '../models/aluno';
import { PageResponse } from '../models/page-response';


export interface FiltroAlunos {
  busca?: string;
  status?: StatusAluno | '';
  pagina?: number;
  tamanho?: number;
  ordenarPor?: string;
  direcao?: 'asc' | 'desc';
}


@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/alunos';

  listar(filtro: FiltroAlunos = {}): Observable<PageResponse<Aluno>> {
    let params = new HttpParams();

    if (filtro.busca?.trim()) {
      params = params.set('busca', filtro.busca.trim());
    }
    if (filtro.status) {
      params = params.set('status', filtro.status);
    }
    if (filtro.pagina != null) {
      params = params.set('pagina', filtro.pagina);
    }
    if (filtro.tamanho != null) {
      params = params.set('tamanho', filtro.tamanho);
    }
    if (filtro.ordenarPor) {
      params = params.set('ordenarPor', filtro.ordenarPor);
    }
    if (filtro.direcao) {
      params = params.set('direcao', filtro.direcao);
    }

    return this.http.get<PageResponse<Aluno>>(this.apiUrl, { params });
  }


  buscarPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`);
  }


  criar(aluno: NovoAlunoRequest): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, aluno);
  }


  atualizar(id: number, aluno: AtualizarAlunoRequest): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, aluno);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
