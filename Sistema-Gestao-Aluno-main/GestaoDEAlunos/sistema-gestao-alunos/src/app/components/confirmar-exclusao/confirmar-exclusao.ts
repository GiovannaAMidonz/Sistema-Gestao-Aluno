import { Component, ElementRef, afterRenderEffect, input, output, viewChild } from '@angular/core';
import { Aluno } from '../../models/aluno';


@Component({
  selector: 'app-confirmar-exclusao',
  templateUrl: './confirmar-exclusao.html',
  styleUrl: './confirmar-exclusao.css',
})
export class ConfirmarExclusaoComponent {
  readonly aluno = input<Aluno | null>(null);
  readonly processando = input(false);
  readonly erro = input<string | null>(null);
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
  private readonly dialogo = viewChild<ElementRef<HTMLDialogElement>>('dialogo');
  private focoAnterior: Element | null = null;

  constructor() {

    afterRenderEffect(() => {
      const dialogo = this.dialogo()?.nativeElement;
      if (!dialogo) return;
      if (this.aluno() && !dialogo.open) {
        this.focoAnterior = document.activeElement;
        dialogo.showModal();
      } else if (!this.aluno() && dialogo.open) {
        dialogo.close();
      }
    });
  }

  aoCancelar(evento: Event): void {
    if (this.processando()) evento.preventDefault();
  }

  aoFechar(): void {
    if (this.aluno()) this.cancelar.emit();
    if (this.focoAnterior instanceof HTMLElement) this.focoAnterior.focus();
    this.focoAnterior = null;
  }
}