// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../services/auth.service';
// import { CommonModule } from '@angular/common';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-forgot-password',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   template: `
//     <div class="container mt-5">
//       <h2>Forgot Password</h2>
//       <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
//         <div class="mb-3">
//           <label for="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             class="form-control"
//             formControlName="email"
//             placeholder="Enter your email"
//           />
//           <div *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched" class="text-danger">
//             Valid email is required.
//           </div>
//         </div>

//         <button
//           class="btn btn-primary"
//           type="submit"
//           [disabled]="forgotForm.invalid || isLoading"
//         >
//           Send Reset Link
//         </button>
//       </form>
//     </div>
//   `
// })
// export class ForgotPasswordComponent {
//   forgotForm: FormGroup;
//   isLoading = false;

//   constructor(private fb: FormBuilder, private authService: AuthService) {
//     this.forgotForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }

//   onSubmit() {
//     if (this.forgotForm.invalid) {
//       this.forgotForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.authService.forgotPassword({ email: this.forgotForm.value.email }).subscribe({
//       next: (res) => {
//         this.isLoading = false;
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: res
//         });
//       },
//       error: (err) => {
//         this.isLoading = false;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'An error occurred while sending the password reset email.'
//         });
//         console.error('Forgot password error:', err);
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <h2>Forgot Password</h2>
      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            formControlName="email"
            placeholder="Enter your email"
          />
          <div *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched" class="text-danger">
            Valid email is required.
          </div>
        </div>

        <button
          class="btn btn-primary"
          type="submit"
          [disabled]="forgotForm.invalid || isLoading"
        >
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword({ email: this.forgotForm.value.email }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: typeof res === 'string' ? res : res?.message || 'Password reset email sent.'
        });
      },
      error: (err) => {
        this.isLoading = false;

        let errorMessage = 'An error occurred while sending the password reset email.';
        if (err?.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
        console.error('Forgot password error:', err);
      }
    });
  }
}
