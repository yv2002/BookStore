import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
     <app-navbar></app-navbar>
    <div class="container my-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary">👥 Registered Users</h2>
        <div>
          <button class="btn btn-success me-2" (click)="openAddUserForm()">➕ Add User</button>
          <button class="btn btn-outline-secondary" (click)="goToBookList()">
            <i class="bi bi-arrow-left"></i> Back to Books
          </button>
        </div>
      </div>

      <!-- Users List -->
      <div *ngIf="users?.length; else noUsers">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let user of users">
            <div class="card user-card h-100 shadow-sm border-0">
              <div class="card-body d-flex align-items-center gap-3">
                <img
                  [src]="user.avatar || fallbackAvatar"
                  class="rounded-circle avatar-img border border-2"
                  width="60"
                  height="60"
                  alt="User Avatar"
                />

                <div class="flex-grow-1">
                  <h5 class="mb-1">{{ user.username }}</h5>
                  <span
                    class="badge"
                    [ngClass]="{
                      'bg-primary': user.role === 'user',
                      'bg-dark': user.role === 'admin'
                    }"
                  >
                    {{ user.role | titlecase }}
                  </span>
                </div>

                <button
                  class="btn btn-sm btn-outline-danger rounded-circle"
                  (click)="confirmDelete(user.username)"
                  title="Delete User"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noUsers>
        <div class="alert alert-warning text-center mt-4 shadow-sm">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> No registered users found.
        </div>
      </ng-template>
    </div>

    <!-- Add User Modal -->
    <div *ngIf="showAddUser" class="modal-backdrop">
      <div class="modal-content">
        <h4>Add New User</h4>
        <form (ngSubmit)="createUser()">
          <div class="mb-3">
            <label>Username</label>
            <input type="text" [(ngModel)]="newUser.username" name="username" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Avatar</label>
            <input type="text" [(ngModel)]="newUser.avatar" name="avatar" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" [(ngModel)]="newUser.email" name="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Role</label>
            <select [(ngModel)]="newUser.role" name="role" class="form-control" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button class="btn btn-primary w-100" type="submit">Send OTP</button>
          <button class="btn btn-secondary w-100 mt-2" (click)="closeAddUserForm()" type="button">Cancel</button>
        </form>
      </div>
    </div>

    <!-- OTP & Password Setup Modal -->
    <div *ngIf="showOtpForm" class="modal-backdrop">
      <div class="modal-content">
        <h4>Set Password</h4>
        <form (ngSubmit)="setPasswordWithOtp()">
          <div class="mb-3">
            <label>OTP</label>
            <input type="text" [(ngModel)]="otp" name="otp" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>New Password</label>
            <input type="password" [(ngModel)]="newPassword" name="newPassword" class="form-control" required />
          </div>
          <button class="btn btn-success w-100" type="submit">Confirm Password</button>
          <button class="btn btn-secondary w-100 mt-2" (click)="closeOtpForm()" type="button">Cancel</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .user-card { transition: transform 0.2s ease, box-shadow 0.2s ease; border-radius: 1rem; }
    .user-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }
    .avatar-img { object-fit: cover; }
    .btn-outline-danger:hover { background-color: #dc3545; color: white; }
    .badge { font-size: 0.85rem; padding: 0.4em 0.65em; }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center;
    }
    .modal-content {
      background: white; padding: 20px; border-radius: 10px; width: 400px; max-width: 90%;
    }
  `]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  fallbackAvatar: string = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';
  private authService = inject(AuthService);
  private router = inject(Router);

  showAddUser = false;
  showOtpForm = false;

  newUser: any = { username: '', email: '', avatar: '', role: 'user' };
  otp = '';
  newPassword = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (res: User[]) => (this.users = res),
      error: (err: any) => console.error('Error fetching users:', err),
    });
  }

  openAddUserForm() { this.showAddUser = true; }
  closeAddUserForm() { this.showAddUser = false; }

  openOtpForm() { this.showOtpForm = true; }
  closeOtpForm() { this.showOtpForm = false; }

  createUser() {
    this.authService.createUser(this.newUser).subscribe({
      next: () => {
        Swal.fire('OTP Sent!', `An OTP was sent to ${this.newUser.email}`, 'success');
        this.closeAddUserForm();
        this.openOtpForm();
      },
      error: (err) => console.error('Error creating user:', err),
    });
  }

  setPasswordWithOtp() {
    const payload = {
      email: this.newUser.email,
      otp: this.otp,
      newPassword: this.newPassword,
    };

    this.authService.setPasswordWithOtp(payload).subscribe({
      next: () => {
        Swal.fire('Success!', 'Password set successfully.', 'success');
        this.closeOtpForm();
        this.loadUsers();
      },
      error: (err) => console.error('Error setting password:', err),
    });
  }

  confirmDelete(username: string) {
    Swal.fire({
      title: `Delete "${username}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(username);
        Swal.fire('Deleted!', `User "${username}" has been deleted.`, 'success');
      }
    });
  }

  deleteUser(username: string) {
    this.authService.deleteUser(username).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.username !== username);
      },
      error: (err) => console.error('Error deleting user:', err),
    });
  }

  goToBookList() {
    this.router.navigate(['/list']);
  }
}
