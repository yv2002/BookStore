
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const currentRole = authService.getUserRole(); // e.g., "admin" or "user"
if (currentRole && allowedRoles.includes(currentRole)) {
  return true;
}

  // Redirect or show access denied page if needed
  router.navigate(['/unauthorized']);
  return false;
};
