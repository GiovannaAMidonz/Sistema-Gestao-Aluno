import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {

    localStorage.removeItem('sessao');
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('sessao');
  });


  async function botaoCom(usuario: string, senha: string): Promise<HTMLButtonElement> {
    fixture.componentInstance.form.setValue({ usuario, senha });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  it('desabilita Acessar com campos vazios', async () => {
    expect((await botaoCom('', '')).disabled).toBe(true);
  });

  it('habilita Acessar com credenciais no formato válido', async () => {
    expect((await botaoCom('admin123', 'Admin1234')).disabled).toBe(false);
  });

  it('desabilita usuário menor que oito caracteres (RN-002)', async () => {
    expect((await botaoCom('admin', 'Admin1234')).disabled).toBe(true);
  });

  it('desabilita senha sem números (RN-003)', async () => {
    expect((await botaoCom('admin123', 'somenteletras')).disabled).toBe(true);
  });

  it('envia Basic e não revela qual credencial falhou no 401', async () => {
    await botaoCom('admin123', 'Admin1234');
    fixture.componentInstance.entrar();
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true);
    const requisicao = http.expectOne('http://localhost:8080/api/auth/me');
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin123:Admin1234'));
    requisicao.flush({ mensagem: 'Senha errada' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Usuário ou senha inválidos.');
  });
});