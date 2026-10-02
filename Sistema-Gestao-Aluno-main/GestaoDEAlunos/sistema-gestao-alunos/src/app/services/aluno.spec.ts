import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { authInterceptor } from './auth.interceptor';
import { AlunoService } from './aluno';

describe('AlunoService', () => {
  let service: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    service = TestBed.inject(AlunoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('envia Basic em listar, buscar, criar, atualizar e excluir', () => {
    TestBed.inject(AuthService).sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'token-teste' });
    const http = TestBed.inject(HttpTestingController);
    const aluno = {
      nomeCompleto: 'Ana Souza', email: 'ana@email.com', telefone: '11999999999',
      fotoUrl: null, status: 'ATIVO' as const,
    };

    service.listar().subscribe();
    service.buscarPorId(1).subscribe();
    service.criar({ ...aluno, cpf: '12345678909' }).subscribe();
    service.atualizar(1, aluno).subscribe();
    service.excluir(1).subscribe();

    for (const [method, url] of [
      ['GET', 'http://localhost:8080/api/alunos'],
      ['GET', 'http://localhost:8080/api/alunos/1'],
      ['POST', 'http://localhost:8080/api/alunos'],
      ['PUT', 'http://localhost:8080/api/alunos/1'],
      ['DELETE', 'http://localhost:8080/api/alunos/1'],
    ]) {
      const request = http.expectOne((item) => item.method === method && item.url === url);
      expect(request.request.headers.get('Authorization')).toBe('Basic token-teste');
      request.flush(method === 'DELETE' ? null : {});
    }
    http.verify();
  });
});
