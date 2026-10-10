import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Aluno } from '../../models/aluno';
import { AuthService } from '../../services/auth';
import { AlunoDetalhesComponent } from './aluno-detalhes';

describe('AlunoDetalhesComponent', () => {
  it('mostra dados para leitor, mas só oferece ações de alteração ao administrador', async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoDetalhesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }],
    }).compileComponents();
    const auth = TestBed.inject(AuthService);
    auth.sessao.set({ username: 'leitor123', perfil: 'LEITOR', token: 'leitor' });
    const fixture = TestBed.createComponent(AlunoDetalhesComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    const aluno: Aluno = {
      id: 1, matricula: '2024001', nomeCompleto: 'Ana Souza', cpf: '12345678909',
      email: 'ana@email.com', telefone: '11999999999', fotoUrl: null, status: 'ATIVO',
    };
    http.expectOne('http://localhost:8080/api/alunos/1').flush(aluno);
    fixture.detectChanges();
    const tela = fixture.nativeElement as HTMLElement;
    expect(tela.textContent).toContain('Ana Souza');
    expect(tela.querySelector('.botoes')).toBeNull();

    auth.sessao.set({ username: 'admin123', perfil: 'ADMINISTRADOR', token: 'admin' });
    fixture.detectChanges();
    expect(tela.querySelector('.botoes')?.textContent).toContain('Editar');
    expect(tela.querySelector('.botoes')?.textContent).toContain('Arquivar');
    expect(tela.querySelector('.botoes')?.textContent).toContain('Excluir');
    http.verify();
  });
});