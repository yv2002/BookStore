import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports:[CommonModule],
  template: `
    <div class="container mt-5 text-center">
      <h3>{{ statusMessage }}</h3>
      <div *ngIf="isSuccess">
        <p>Redirecting to login...</p>
      </div>
    </div>
  `
})
export class VerifyEmailComponentComponent implements OnInit {
  statusMessage = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('userId') || '';
    const token = this.route.snapshot.queryParamMap.get('token') || '';

    if (userId && token) {
      this.authService.confirmEmail(userId, token).subscribe({
        next: (res) => {
          this.statusMessage = '✅ Email verified successfully.';
          this.isSuccess = true;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: () => {
          this.statusMessage = '❌ Email verification failed or link expired.';
        }
      });
    } else {
      this.statusMessage = 'Invalid verification link.';
    }
  }
}
