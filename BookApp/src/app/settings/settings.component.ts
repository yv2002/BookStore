import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-lg rounded-4 p-4">
            <div class="card-body">
              <h3 class="card-title mb-4 text-center">
                <i class="bi bi-gear-fill me-2"></i> Settings
              </h3>

              <div class="form-check form-switch d-flex align-items-center justify-content-between">
                <label class="form-check-label fw-semibold fs-6" for="themeToggle">
                  Dark Mode
                </label>
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="themeToggle"
                  [(ngModel)]="darkMode"
                  (change)="toggleTheme()"
                />
              </div>

              <div class="text-center mt-4">
                <span class="badge bg-secondary" *ngIf="darkMode">Dark theme active</span>
                <span class="badge bg-light text-dark border" *ngIf="!darkMode">Light theme active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background-color: var(--bs-body-bg);
        color: var(--bs-body-color);
      }

      .dark-theme .card {
        background-color: #1e1e2f !important;
        color: #f1f1f1 !important;
      }
    `,
  ],
})
export class SettingsComponent {
  darkMode: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.darkMode = this.authService.getThemePreference() === 'dark';
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
      this.authService.setThemePreference('dark');
    } else {
      document.body.classList.remove('dark-theme');
      this.authService.setThemePreference('light');
    }
  }
}
