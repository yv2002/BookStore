import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-set-password',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center">Set Your Password</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">
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
export class SetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  token: string | null = null;
  email: string | null = null;

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch }
  );

  errorMessage: string | null = null;
userId: string | null = null;

constructor() {
  this.route.queryParams.subscribe((params) => {
    this.token = params['token'] || null;
    this.userId = params['userId'] || null; // ✅ use userId
  });
}

  // ✅ Custom validator for matching passwords
  private passwordsMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  submit() {
  if (this.form.invalid || !this.token || !this.userId) return;

  const payload = {
    userId: this.userId,      // ✅ use userId not email
    token: this.token,
    newPassword: this.form.value.password!,
  };

  this.auth.setPassword(payload).subscribe({
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
