import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as UserRole[] | undefined;
  const requiredRole = route.data['role'] as UserRole | undefined;
  const allowedRoles = requiredRoles ?? (requiredRole ? [requiredRole] : []);

  if (allowedRoles.some(role => authService.hasRole(role))) {
    return true;
  }

  return router.createUrlTree([authService.hasRole('admin') ? '/dashboard' : '/product']);
};