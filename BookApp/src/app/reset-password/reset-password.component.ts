import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="reset-password-container">
    <h2>Reset Password</h2>
    <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">

      <div>
        <label>Email</label>
        <input formControlName="email" type="email" readonly />
      </div>

      <div>
        <label>New Password</label>
        <input formControlName="newPassword" type="password" />
        <div *ngIf="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid">
         <small *ngIf="resetForm.get('newPassword')?.errors?.['required']">
  Password is required
</small>

<small *ngIf="resetForm.get('newPassword')?.errors?.['minlength']">
  Password must be at least 6 characters
</small>

        </div>
      </div>

      <div>
        <label>Confirm Password</label>
        <input formControlName="confirmPassword" type="password" />
        <div *ngIf="resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched">
          <small>Passwords do not match</small>
        </div>
      </div>

      <button type="submit" [disabled]="resetForm.invalid">Reset Password</button>

      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
  `,
  styles: [`
    .reset-password-container {
      max-width: 400px;
      margin: auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      margin: 0.25rem 0 0.5rem 0;
      box-sizing: border-box;
    }
    label {
      font-weight: 600;
    }
    .error {
      color: red;
      margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  errorMessage = '';
  private email: string = '';
  private token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        token: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );

    this.route.queryParams.subscribe(params => {
      const emailParam = params['email'] ?? '';
      const tokenParam = params['token'] ?? '';

      if (emailParam && tokenParam) {
        this.email = emailParam;
        this.token = tokenParam;
        this.resetForm.patchValue({ email: this.email, token: this.token });
      } else {
        this.errorMessage = 'Invalid or missing reset link parameters.';
      }
    });
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { mismatch: true }
      : null;
  }

  onSubmit(): void {
  if (this.resetForm.invalid) {
    this.resetForm.markAllAsTouched();
    return;
  }

  const { newPassword } = this.resetForm.getRawValue();

  this.authService.resetPassword({ email: this.email, token: this.token, newPassword }).subscribe({
    next: (res: { message: string }) => {   // ✅ enforce correct type
      Swal.fire('Success', res.message || 'Your password has been reset.', 'success')
        .then(() => this.router.navigate(['/login']));
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
    }
  });
}

}
