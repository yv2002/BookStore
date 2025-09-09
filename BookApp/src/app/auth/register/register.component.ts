// // import { Component, inject } from '@angular/core';
// // import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// // import { AuthService } from '../../services/auth.service';
// // import { Router } from '@angular/router';
// // import { CommonModule } from '@angular/common';
// // import Swal from 'sweetalert2';

// // // ✅ Image URL Validator
// // function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
// //   const value = control.value;
// //   if (!value) return null;
// //   const pattern = /\.(jpeg|jpg|gif|png|bmp|webp)$/i;
// //   return pattern.test(value) ? null : { invalidImageUrl: true };
// // }

// // @Component({
// //   standalone: true,
// //   selector: 'app-register',
// //   imports: [ReactiveFormsModule, CommonModule],
// //   template: `
// //     <div class="container mt-5">
// //       <h2 class="text-center">Register</h2>
// //       <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">

// //         <!-- Email -->
// //         <div class="mb-3">
// //           <label for="email" class="form-label">Email</label>
// //           <input id="email" formControlName="email" type="email" class="form-control" placeholder="Enter email" />
// //           <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-danger">
// //             <small *ngIf="form.controls.email.errors?.['required']">Email is required.</small>
// //             <small *ngIf="form.controls.email.errors?.['email']">Enter a valid email.</small>
// //           </div>
// //         </div>

// //         <!-- Username -->
// //         <div class="mb-3">
// //           <label for="username" class="form-label">Username</label>
// //           <input id="username" formControlName="username" type="text" class="form-control" placeholder="Enter username" />
// //           <div *ngIf="form.controls.username.invalid && form.controls.username.touched" class="text-danger">
// //             <small *ngIf="form.controls.username.errors?.['required']">Username is required.</small>
// //             <small *ngIf="form.controls.username.errors?.['minlength']">Minimum 3 characters.</small>
// //           </div>
// //         </div>

// //         <!-- Password -->
// //         <div class="mb-3">
// //           <label for="password" class="form-label">Password</label>
// //           <input id="password" formControlName="password" type="password" class="form-control" placeholder="Enter password" />
// //           <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-danger">
// //             <small *ngIf="form.controls.password.errors?.['required']">Password is required.</small>
// //             <small *ngIf="form.controls.password.errors?.['minlength']">Minimum 6 characters.</small>
// //           </div>
// //         </div>

// //         <!-- Role -->
// //         <div class="mb-3">
// //           <label for="role" class="form-label">Role</label>
// //           <select id="role" formControlName="role" class="form-select">
// //             <option value="" disabled>Select role</option>
// //             <option value="user">User</option>
// //             <option value="admin">Admin</option>
// //           </select>
// //           <div *ngIf="form.controls.role.invalid && form.controls.role.touched" class="text-danger">
// //             <small>Role is required.</small>
// //           </div>
// //         </div>

// //         <!-- Image URL -->
// //         <div class="mb-3">
// //           <label for="imgUrl" class="form-label">Profile Image URL (optional)</label>
// //           <input id="imgUrl" formControlName="imgUrl" type="text" class="form-control" placeholder="Enter image URL" />
// //           <div *ngIf="form.controls.imgUrl.invalid && form.controls.imgUrl.touched" class="text-danger">
// //             <small *ngIf="form.controls.imgUrl.errors?.['invalidImageUrl']">
// //               Enter a valid image URL (jpg, jpeg, png, gif, bmp, webp).
// //             </small>
// //           </div>
// //         </div>

// //         <!-- Image Preview -->
// //         <div *ngIf="form.controls.imgUrl.valid && form.controls.imgUrl.value" class="mb-3 text-center">
// //           <img [src]="form.controls.imgUrl.value" alt="Profile Preview" style="max-width: 150px; border-radius: 50%;" />
// //         </div>

// //         <!-- Submit Button -->
// //         <div class="mb-3">
// //           <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">Register</button>
// //         </div>
// //       </form>

// //       <!-- Error Message -->
// //       <div *ngIf="errorMessage" class="alert alert-danger mt-3">
// //         {{ errorMessage }}
// //       </div>

// //       <!-- Redirect to Login -->
// //       <div class="text-center mt-3">
// //         <p>Already have an account? <a href="#" (click)="goLogin($event)">Login here</a></p>
// //       </div>
// //     </div>
// //   `,
// // })
// // export class RegisterComponent {
// //   private fb = inject(FormBuilder);
// //   private auth = inject(AuthService);
// //   private router = inject(Router);

// //   form = this.fb.group({
// //     email: ['', [Validators.required, Validators.email]],
// //     username: ['', [Validators.required, Validators.minLength(3)]],
// //     password: ['', [Validators.required, Validators.minLength(6)]],
// //     role: ['', Validators.required],
// //     imgUrl: ['', imageUrlValidator],
// //   });

// //   errorMessage: string | null = null;

// //   submit() {
// //     if (this.form.invalid) return;

// //     const formValue = {
// //       email: this.form.value.email,
// //       username: this.form.value.username,
// //       password: this.form.value.password,
// //       role: this.form.value.role,
// //       avatar: this.form.value.imgUrl || 'https://example.com/default-avatar.png',
// //     };

// //     this.auth.register(formValue).subscribe({
// //       next: (response) => {
// //         if (typeof response === 'string' && response.includes('Successfully')) {
// //           Swal.fire({
// //             icon: 'success',
// //             title: 'Registered Successfully',
// //             text: 'Please check your email to verify your account before logging in.',
// //             confirmButtonText: 'Go to Login',
// //           }).then(() => this.router.navigate(['/login']));
// //         } else {
// //           this.errorMessage = response || 'Registration failed.';
// //         }
// //       },
// //       error: (err) => {
// //         console.error('Registration error:', err);
// //         this.errorMessage = 'An error occurred. Try again.';
// //       },
// //     });
// //   }

// //   goLogin(event: Event) {
// //     event.preventDefault();
// //     this.router.navigate(['/login']);
// //   }
// // }
// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import Swal from 'sweetalert2';

// // ✅ Image URL Validator
// function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
//   const value = control.value;
//   if (!value) return null;
//   const pattern = /\.(jpeg|jpg|gif|png|bmp|webp)$/i;
//   return pattern.test(value) ? null : { invalidImageUrl: true };
// }

// @Component({
//   standalone: true,
//   selector: 'app-register',
//   imports: [ReactiveFormsModule, CommonModule],
//   template: `
//     <div class="container mt-5">
//       <h2 class="text-center">Register</h2>
//       <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">

//         <!-- Email -->
//         <div class="mb-3">
//           <label for="email" class="form-label">Email</label>
//           <input id="email" formControlName="email" type="email" class="form-control" placeholder="Enter email" />
//           <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-danger">
//             <small *ngIf="form.controls.email.errors?.['required']">Email is required.</small>
//             <small *ngIf="form.controls.email.errors?.['email']">Enter a valid email.</small>
//           </div>
//         </div>

//         <!-- Username -->
//         <div class="mb-3">
//           <label for="username" class="form-label">Username</label>
//           <input id="username" formControlName="username" type="text" class="form-control" placeholder="Enter username" />
//           <div *ngIf="form.controls.username.invalid && form.controls.username.touched" class="text-danger">
//             <small *ngIf="form.controls.username.errors?.['required']">Username is required.</small>
//             <small *ngIf="form.controls.username.errors?.['minlength']">Minimum 3 characters.</small>
//           </div>
//         </div>

//         <!-- Password -->
//         <div class="mb-3">
//           <label for="password" class="form-label">Password</label>
//           <input id="password" formControlName="password" type="password" class="form-control" placeholder="Enter password" />
//           <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-danger">
//             <small *ngIf="form.controls.password.errors?.['required']">Password is required.</small>
//             <small *ngIf="form.controls.password.errors?.['minlength']">Minimum 6 characters.</small>
//           </div>
//         </div>

//         <!-- Role -->
//         <div class="mb-3">
//           <label for="role" class="form-label">Role</label>
//           <select id="role" formControlName="role" class="form-select">
//             <option value="" disabled>Select role</option>
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//           <div *ngIf="form.controls.role.invalid && form.controls.role.touched" class="text-danger">
//             <small>Role is required.</small>
//           </div>
//         </div>

//         <!-- Image URL -->
//         <div class="mb-3">
//           <label for="imgUrl" class="form-label">Profile Image URL (optional)</label>
//           <input id="imgUrl" formControlName="imgUrl" type="text" class="form-control" placeholder="Enter image URL" />
//           <div *ngIf="form.controls.imgUrl.invalid && form.controls.imgUrl.touched" class="text-danger">
//             <small *ngIf="form.controls.imgUrl.errors?.['invalidImageUrl']">
//               Enter a valid image URL (jpg, jpeg, png, gif, bmp, webp).
//             </small>
//           </div>
//         </div>

//         <!-- Image Preview -->
//         <div *ngIf="form.controls.imgUrl.valid && form.controls.imgUrl.value" class="mb-3 text-center">
//           <img [src]="form.controls.imgUrl.value" alt="Profile Preview" style="max-width: 150px; border-radius: 50%;" />
//         </div>

//         <!-- Submit Button -->
//         <div class="mb-3">
//           <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">Register</button>
//         </div>
//       </form>

//       <!-- Error Message -->
//       <div *ngIf="errorMessage" class="alert alert-danger mt-3">
//         {{ errorMessage }}
//       </div>

//       <!-- Redirect to Login -->
//       <div class="text-center mt-3">
//         <p>Already have an account? <a href="#" (click)="goLogin($event)">Login here</a></p>
//       </div>
//     </div>
//   `,
// })
// export class RegisterComponent {
//   private fb = inject(FormBuilder);
//   private auth: AuthService = inject(AuthService);   // ✅ explicitly typed
//   private router: Router = inject(Router);           // ✅ explicitly typed

//   form = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     username: ['', [Validators.required, Validators.minLength(3)]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//     role: ['', Validators.required],
//     imgUrl: ['', imageUrlValidator],
//   });

//   errorMessage: string | null = null;

//   submit() {
//     if (this.form.invalid) return;

//     const formValue = {
//       email: this.form.value.email!,
//       username: this.form.value.username!,
//       password: this.form.value.password!,
//       role: this.form.value.role!,
//       avatar: this.form.value.imgUrl || 'https://example.com/default-avatar.png',
//     };

//     this.auth.register(formValue).subscribe({
//       next: (response: any) => {
//         const message =
//           typeof response === 'string'
//             ? response
//             : response?.message || 'Registration successful';

//         Swal.fire({
//           icon: 'success',
//           title: 'Registered Successfully',
//           text: 'Please check your email to verify your account before logging in.',
//           confirmButtonText: 'Go to Login',
//         }).then(() => this.router.navigate(['/login']));
//       },
//       error: (err: any) => {
//         console.error('Registration error:', err);
//         this.errorMessage =
//           err?.error?.message || err?.message || 'An error occurred. Try again.';
//       },
//     });
//   }

//   goLogin(event: Event) {
//     event.preventDefault();
//     this.router.navigate(['/login']);
//   }
// }
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// ✅ Image URL Validator
function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const pattern = /\.(jpeg|jpg|gif|png|bmp|webp)$/i;
  return pattern.test(value) ? null : { invalidImageUrl: true };
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center">Register</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" formControlName="email" type="email" class="form-control" placeholder="Enter email" />
          <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-danger">
            <small *ngIf="form.controls.email.errors?.['required']">Email is required.</small>
            <small *ngIf="form.controls.email.errors?.['email']">Enter a valid email.</small>
          </div>
        </div>

        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input id="username" formControlName="username" type="text" class="form-control" placeholder="Enter username" />
          <div *ngIf="form.controls.username.invalid && form.controls.username.touched" class="text-danger">
            <small *ngIf="form.controls.username.errors?.['required']">Username is required.</small>
            <small *ngIf="form.controls.username.errors?.['minlength']">Minimum 3 characters.</small>
          </div>
        </div>

        <!-- Password (Optional) -->
        <div class="mb-3">
          <label for="password" class="form-label">Password (optional)</label>
          <input id="password" formControlName="password" type="password" class="form-control" placeholder="Enter password (optional)" />
          <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-danger">
            <small *ngIf="form.controls.password.errors?.['minlength']">
              Minimum 6 characters (if you choose to set a password now).
            </small>
          </div>
        </div>

        <!-- Role -->
        <div class="mb-3">
          <label for="role" class="form-label">Role</label>
          <select id="role" formControlName="role" class="form-select">
            <option value="" disabled>Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div *ngIf="form.controls.role.invalid && form.controls.role.touched" class="text-danger">
            <small>Role is required.</small>
          </div>
        </div>

        <!-- Image URL -->
        <div class="mb-3">
          <label for="imgUrl" class="form-label">Profile Image URL (optional)</label>
          <input id="imgUrl" formControlName="imgUrl" type="text" class="form-control" placeholder="Enter image URL" />
          <div *ngIf="form.controls.imgUrl.invalid && form.controls.imgUrl.touched" class="text-danger">
            <small *ngIf="form.controls.imgUrl.errors?.['invalidImageUrl']">
              Enter a valid image URL (jpg, jpeg, png, gif, bmp, webp).
            </small>
          </div>
        </div>

        <!-- Image Preview -->
        <div *ngIf="form.controls.imgUrl.valid && form.controls.imgUrl.value" class="mb-3 text-center">
          <img [src]="form.controls.imgUrl.value" alt="Profile Preview" style="max-width: 150px; border-radius: 50%;" />
        </div>

        <!-- Submit Button -->
        <div class="mb-3">
          <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">Register</button>
        </div>
      </form>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>

      <!-- Redirect to Login -->
      <div class="text-center mt-3">
        <p>Already have an account? <a href="#" (click)="goLogin($event)">Login here</a></p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);   
  private router: Router = inject(Router);           

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.minLength(6)]], 
    role: ['', Validators.required],
    imgUrl: ['', imageUrlValidator],
  });

  errorMessage: string | null = null;

  submit() {
    if (this.form.invalid) return;

    const formValue = {
      email: this.form.value.email!,
      username: this.form.value.username!,
      password: this.form.value.password || null,
      role: this.form.value.role!,
      avatar: this.form.value.imgUrl || 'https://example.com/default-avatar.png',
    };

    this.auth.register(formValue).subscribe({
      next: (response: any) => {
        const message =
          typeof response === 'string'
            ? response
            : response?.message || 'Registration successful';

        Swal.fire({
          icon: 'success',
          title: 'Registered Successfully',
          text: 'Please check your email to verify your account before logging in.',
          confirmButtonText: 'Go to Login',
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        this.errorMessage =
          err?.error?.message || err?.message || 'An error occurred. Try again.';
      },
    });
  }

  goLogin(event: Event) {
    event.preventDefault();
   
    this.router.navigate(['/login']);
  }
}
