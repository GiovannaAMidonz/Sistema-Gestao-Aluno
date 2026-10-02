import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';


export const loginGuard: CanActivateFn = () =>
  inject(AuthService).estaLogado() ? inject(Router).createUrlTree(['/']) : true;

export const authGuard: CanActivateFn = () =>
  inject(AuthService).estaLogado() ? true : inject(Router).createUrlTree(['/login']);