import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Aluno } from '../../models/aluno';
import { AlunosComponent } from './alunos';

describe('AlunosComponent', () => {
  let component: AlunosComponent;
  let fixture: ComponentFixture<AlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mantém apenas visualização para leitor e ações completas para administrador', () => {
    const auth = TestBed.inject(AuthService);
    const aluno: Aluno = {
      id: 1, matricula: '2024001', nomeCompleto: 'Ana Souza', cpf: '12345678909',
      email: 'ana@email.com', telefone: '11999999999', fotoUrl: null, status: 'ATIVO',
    };
    auth.sessao.set({ username: 'leitor123', perfil: 'LEITOR', token: 'leitor' });
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne((request) => request.url === 'http://localhost:8080/api/alunos').flush({
      conteudo: [aluno], paginaAtual: 0, totalPaginas: 1, total: 1,
    });
    fixture.detectChanges();
    const tela = fixture.nativeElement as HTMLElement;
    expect(tela.querySelector('[aria-label="Ver detalhes"]')).toBeTruthy();
    expect(tela.querySelector('[aria-label="Editar"]')).toBeNull();
    expect(tela.querySelector('[aria-label="Excluir"]')).toBeNull();
    expect(tela.textContent).not.toContain('Novo Aluno');

    auth.sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'admin' });
    fixture.detectChanges();
    expect(tela.querySelector('[aria-label="Editar"]')).toBeTruthy();
    expect(tela.querySelector('[aria-label="Excluir"]')).toBeTruthy();
    expect(tela.textContent).toContain('Novo Aluno');
    http.verify();
  });
});
