import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let requests: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.removeItem('sessao');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), provideRouter([{ path: 'login', children: [] }])],
    });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    requests.verify();
    localStorage.removeItem('sessao');
  });

  it('envia o Basic da sessão para a API de alunos', () => {
    auth.sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'token-teste' });
    http.get('http://localhost:8080/api/alunos').subscribe();
    const request = requests.expectOne('http://localhost:8080/api/alunos');
    expect(request.request.headers.get('Authorization')).toBe('Basic token-teste');
    request.flush([]);
  });

  it('não anexa o Basic a outros servidores nem sobrescreve o header do login', () => {
    auth.sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'token-teste' });
    http.get('https://exemplo.com/api/alunos').subscribe();
    const external = requests.expectOne('https://exemplo.com/api/alunos');
    expect(external.request.headers.has('Authorization')).toBe(false);
    external.flush([]);

    http.get('http://localhost:8080/api/auth/me', { headers: { Authorization: 'Basic novo-token' } }).subscribe();
    const login = requests.expectOne('http://localhost:8080/api/auth/me');
    expect(login.request.headers.get('Authorization')).toBe('Basic novo-token');
    login.flush({ username: 'admin123', perfil: 'ADMINISTRADOR' });
  });

  it('encerra a sessão quando a API responde 401', () => {
    auth.sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'token-velho' });
    http.get('http://localhost:8080/api/alunos').subscribe({ error: () => {} });
    requests.expectOne('http://localhost:8080/api/alunos').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(auth.estaLogado()).toBe(false);
  });

  it('não adiciona Authorization antes do login ou depois de sair', () => {
    http.get('http://localhost:8080/api/alunos').subscribe();
    const request = requests.expectOne('http://localhost:8080/api/alunos');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });
});

describe('authInterceptor com sessão persistida', () => {
  it('lê o token salvo ao criar o AuthService', () => {
    localStorage.setItem('sessao', JSON.stringify({
      username: 'admin123', perfil: 'ADMINISTRADOR', token: 'token-salvo',
    }));
    try {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
      });
      const http = TestBed.inject(HttpClient);
      const requests = TestBed.inject(HttpTestingController);
      http.get('http://localhost:8080/api/alunos').subscribe();
      const request = requests.expectOne('http://localhost:8080/api/alunos');
      expect(request.request.headers.get('Authorization')).toBe('Basic token-salvo');
      request.flush([]);
      requests.verify();
    } finally {
      localStorage.removeItem('sessao');
    }
  });
});