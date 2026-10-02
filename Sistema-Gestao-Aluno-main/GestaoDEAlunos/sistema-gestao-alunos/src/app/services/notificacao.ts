import { Injectable, signal } from '@angular/core';






@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  readonly mensagem = signal<string | null>(null);

  sucesso(texto: string): void {
    this.mensagem.set(texto);
  }

  limpar(): void {
    this.mensagem.set(null);
  }
}
