import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectToListGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate(['/list']); // Redirect to the list page if the user is already authenticated
      return false; // Prevent navigating to the login page
    }
    return true; // Allow navigation to the login page if the user is not authenticated
  }
}
