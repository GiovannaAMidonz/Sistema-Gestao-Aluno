import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.sessao()?.token;
  if (!token || !request.url.startsWith('http://localhost:8080/api/') || request.headers.has('Authorization')) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { Authorization: `Basic ${token}` } })).pipe(
    catchError((erro) => {
      // Sessão salva não vale mais: volta para o login em vez de mostrar erro genérico.
      if (erro instanceof HttpErrorResponse && erro.status === 401) {
        auth.sair();
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    }),
  );
};
