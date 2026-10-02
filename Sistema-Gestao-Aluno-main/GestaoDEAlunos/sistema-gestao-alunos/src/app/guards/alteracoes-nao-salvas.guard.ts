import { CanDeactivateFn } from '@angular/router';


export interface TemAlteracoesNaoSalvas {
  podeSair(): boolean;
}


export const alteracoesNaoSalvasGuard: CanDeactivateFn<TemAlteracoesNaoSalvas> = (component) =>
  component.podeSair();
