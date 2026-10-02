
export type StatusAluno = 'ATIVO' | 'INATIVO';


export interface Aluno {
  id: number;
  matricula: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  fotoUrl: string | null;
  status: StatusAluno;
}

export type AtualizarAlunoRequest = Pick<Aluno, 'nomeCompleto' | 'email' | 'telefone' | 'fotoUrl' | 'status'>;


export type NovoAlunoRequest = Omit<Aluno, 'id' | 'matricula'>;
