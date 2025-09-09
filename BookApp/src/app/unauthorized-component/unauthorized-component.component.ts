
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-unauthorized',
  imports:[RouterLink],
  template: `
    <div class="container mt-5 text-center">
      <h1 class="text-danger">403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <a routerLink="/list" class="btn btn-primary">Go Back</a>
    </div>
  `,
})
export class UnauthorizedComponent {}
