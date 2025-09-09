import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-set-password-otp',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center">Set Your Password (via OTP)</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            formControlName="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
          />
          <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-danger">
            <small *ngIf="form.controls.email.errors?.['required']">Email is required.</small>
            <small *ngIf="form.controls.email.errors?.['email']">Invalid email.</small>
          </div>
        </div>

        <!-- OTP -->
        <div class="mb-3">
          <label for="otp" class="form-label">OTP</label>
          <input
            id="otp"
            formControlName="otp"
            type="text"
            class="form-control"
            placeholder="Enter the OTP"
          />
          <div *ngIf="form.controls.otp.invalid && form.controls.otp.touched" class="text-danger">
            <small *ngIf="form.controls.otp.errors?.['required']">OTP is required.</small>
          </div>
        </div>

        <!-- New Password -->
        <div class="mb-3">
          <label for="password" class="form-label">New Password</label>
          <input
            id="password"
            formControlName="password"
            type="password"
            class="form-control"
            placeholder="Enter new password"
          />
          <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-danger">
            <small *ngIf="form.controls.password.errors?.['required']">Password is required.</small>
            <small *ngIf="form.controls.password.errors?.['minlength']">Minimum 6 characters.</small>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            formControlName="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm password"
          />
          <div *ngIf="form.hasError('passwordMismatch') && form.controls.confirmPassword.touched" class="text-danger">
            <small>Passwords do not match.</small>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mb-3">
          <button type="submit" class="btn btn-success w-100" [disabled]="form.invalid">
            Set Password
          </button>
        </div>
      </form>

      <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  `,
})
export class SetPasswordOtpComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch }
  );

  errorMessage: string | null = null;

  // ✅ Custom validator for matching passwords
  private passwordsMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      email: this.form.value.email!,
      otp: this.form.value.otp!,
      newPassword: this.form.value.password!,
    };

    this.auth.setPasswordWithOtp(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password Set Successfully',
          text: 'You can now log in with your new password.',
          confirmButtonText: 'Go to Login',
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err) => {
        console.error('Set password error:', err);
        this.errorMessage =
          err?.error?.message || err?.message || 'An error occurred. Try again.';
      },
    });
  }
}
