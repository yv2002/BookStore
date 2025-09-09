import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
     <div class="container mt-5" style="max-width: 500px;">
      <h2 class="mb-4 text-center">Edit Profile</h2>
      <form (ngSubmit)="updateProfile()" #profileForm="ngForm" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label fw-semibold">Username <span class="text-danger">*</span></label>
          <input
            type="text"
            id="username"
            class="form-control"
            [(ngModel)]="userProfile.username"
            name="username"
            required
            #username="ngModel"
            [ngClass]="{'is-invalid': username.invalid && username.touched, 'is-valid': username.valid && username.touched}"
            placeholder="Enter your username"
          />
          <div class="invalid-feedback">Username is required.</div>
        </div>

        <div class="mb-4">
          <label for="avatar" class="form-label fw-semibold">Avatar URL</label>
          <input
            type="url"
            id="avatar"
            class="form-control"
            [(ngModel)]="userProfile.avatar"
            name="avatar"
            placeholder="Enter avatar image URL (optional)"
          />
          <small class="form-text text-muted">Provide a URL for your profile picture.</small>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          [disabled]="profileForm.invalid"
        >
          Update Profile
        </button>
      </form>
    </div>
  `,
})
export class ProfileComponent {
  userProfile: { username: string; avatar: string | null } = { username: '', avatar: '' };

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.userProfile = this.authService.getUserProfile() || { username: '', avatar: '' };
  }

  updateProfile() {
    if (this.userProfile.username) {
      this.authService.updateUserProfile(this.userProfile).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/list']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'There was an error updating your profile. Please try again.',
          });
          console.error(err);
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please enter your username.',
      });
    }
  }
}
