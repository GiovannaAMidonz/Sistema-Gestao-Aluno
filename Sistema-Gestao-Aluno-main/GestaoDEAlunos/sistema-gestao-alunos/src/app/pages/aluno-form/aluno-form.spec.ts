import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Aluno } from '../../models/aluno';
import { AlunoFormComponent } from './aluno-form';

const aluno: Aluno = {
  id: 7, matricula: 'MAT-7', cpf: '12345678909', nomeCompleto: 'Ana Souza',
  email: 'ana@email.com', telefone: '11999999999', fotoUrl: null, status: 'ATIVO',
};

describe('AlunoFormComponent', () => {

  it('normaliza o PUT e não envia CPF nem matrícula', async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } }],
    }).compileComponents();
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(AlunoFormComponent);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/alunos/7').flush(aluno);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.temAlteracoes()).toBe(false);
    expect(component.podeSalvar()).toBe(false);

    component.form.controls.nomeCompleto.setValue(' Ana  Souza ');
    component.form.controls.email.setValue(' ANA@EMAIL.COM ');
    expect(component.temAlteracoes()).toBe(false);

    component.form.controls.email.setValue('ANA@EMAIL.COM');
    component.form.controls.nomeCompleto.setValue('Ana Maria Souza');
    expect(component.podeSalvar()).toBe(true);
    component.salvar();
    const requisicao = http.expectOne('http://localhost:8080/api/alunos/7');
    expect(requisicao.request.method).toBe('PUT');
    expect(requisicao.request.body).toEqual({
      nomeCompleto: 'Ana Maria Souza', email: 'ana@email.com', telefone: '11999999999',
      fotoUrl: null, status: 'ATIVO',
    });
    requisicao.flush(aluno);
    http.verify();
  });
});