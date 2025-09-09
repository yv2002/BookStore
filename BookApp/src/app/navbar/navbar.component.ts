import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userProfile = inject(AuthService).getUserProfile();
  authService = inject(AuthService);
  router = inject(Router);
  isAdmin = this.userProfile?.role === 'admin';
  searchQuery = '';
  cartCount = 0;

  ngOnInit() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) this.cartCount = JSON.parse(storedCart).length;
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('cart');
        this.authService.logout();
        Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToFavourites() {
    this.router.navigate(['/favourites']);
  }
  onSearchChange(query: string) {
  this.router.navigate(['/list'], { queryParams: { search: query } });
}
}
