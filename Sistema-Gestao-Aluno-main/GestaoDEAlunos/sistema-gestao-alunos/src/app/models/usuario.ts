
export type Perfil = 'ADMINISTRADOR' | 'LEITOR';


export interface UsuarioLogado {
  username: string;
  perfil: Perfil;
}


export interface Sessao extends UsuarioLogado {
  token: string;
}