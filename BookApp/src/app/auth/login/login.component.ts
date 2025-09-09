import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-4">
          <div class="card shadow-lg p-4">
            <h2 class="text-center mb-4">Login</h2>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  formControlName="username"
                  id="username"
                  class="form-control"
                  placeholder="Enter your username"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  formControlName="password"
                  id="password"
                  type="password"
                  class="form-control"
                  placeholder="Enter your password"
                />
              </div>

              <!-- Error message -->
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>

            <p class="mt-3 text-center">
              Don't have an account? 
              <a href="#" (click)="goToRegister(); $event.preventDefault()">Register here</a>
            </p>

            <p class="mt-2 text-center">
              <a href="#" (click)="forgotPassword($event)">Forgot Password?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        border-radius: 8px;
      }
      .error {
        color: red;
        font-size: 12px;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;

  form = this.fb.group({
    username: '',
    password: '',
  });

  submit() {
    if (this.form.valid) {
      this.errorMessage = null; // clear previous errors

      this.auth.login(this.form.value).subscribe({
        next: (res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Logged In!',
              text: 'Welcome back!',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['list']);
            });
          } else {
            this.errorMessage = 'Invalid username or password.';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Invalid username or password.';
        },
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  forgotPassword(event: Event) {
  event.preventDefault();

  Swal.fire({
    title: 'Forgot Password',
    text: 'Enter your email to reset your password',
    input: 'email',
    inputPlaceholder: 'Enter your email',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    inputValidator: (value) => {
      if (!value || !value.includes('@')) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const email = result.value;

      this.auth.forgotPassword({ email }).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Check Your Email',
            text: 'A password reset link has been sent to your email.',
          });
        },
        error: (err) => {
          console.error('Forgot password error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to process request. Please try again later.',
          });
        },
      });
    }
  });
}
}