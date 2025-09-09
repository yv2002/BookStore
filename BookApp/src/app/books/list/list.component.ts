
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let book of filteredBooks">
          <div class="card h-100 shadow-lg position-relative border-0 rounded-4 overflow-hidden">
            <img [src]="book.coverImageUrl" class="card-img-top book-img" alt="{{ book.title }}" loading="lazy" />
            
            <!-- Wishlist -->
            <button *ngIf="!isAdmin"
              class="btn btn-sm position-absolute top-0 end-0 m-3 wishlist-btn"
              [ngClass]="{
                'btn-outline-danger': !isWishlisted(book.id),
                'btn-danger': isWishlisted(book.id)
              }"
              (click)="toggleWishlist(book.id)">
              <i class="bi" [ngClass]="{
                'bi-heart': !isWishlisted(book.id),
                'bi-heart-fill': isWishlisted(book.id)
              }"></i>
            </button>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold text-primary">{{ book.title }}</h5>
              <p class="card-text text-muted mb-1"><strong>Author:</strong> {{ book.author }}</p>
              <p class="card-text text-muted mb-1"><strong>Published:</strong> {{ book.publishedDate | date: 'shortDate' }}</p>
              <p class="card-text text-muted mb-3"><strong>Available:</strong> {{ getAvailableStock(book.id) }}</p>

              <button *ngIf="userProfile" class="btn btn-outline-primary btn-sm shadow-sm mb-2" [routerLink]="['/view', book.id]">View</button>
              
              <!-- Add to Cart -->
              <button *ngIf="userProfile && !isAdmin"
                class="btn btn-primary btn-sm shadow-sm mb-2"
                [disabled]="getAvailableStock(book.id) <= 0"
                (click)="addToCart(book)">
                {{ getAvailableStock(book.id) <= 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>

              <!-- Admin Buttons -->
              <div class="mt-auto d-flex justify-content-between gap-2" *ngIf="isAdmin">
                <button [routerLink]="['/edit', book.id]" class="btn btn-outline-info btn-sm shadow-sm flex-grow-1">Edit</button>
                <button (click)="deleteBook(book.id)" class="btn btn-outline-danger btn-sm shadow-sm flex-grow-1">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-img {
      height: 280px;
      object-fit: cover;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
    .wishlist-btn {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      z-index: 10;
      font-size: 1.3rem;
      transition: all 0.3s ease;
    }
    .wishlist-btn.btn-outline-danger:hover {
      background-color: #dc3545;
      color: white;
    }
    .btn-outline-info:hover {
      background-color: #17a2b8;
      color: white;
    }
    .btn-outline-danger:hover {
      background-color: #dc3545;
      color: white;
    }
    .card {
      border: none;
      border-radius: 1rem;
      background: #fff;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
    }
    .container {
      max-width: 1100px;
    }
    .navbar input.form-control {
      max-width: 300px;
      min-width: 180px;
    }
  `]
})
export class ListComponent {

  books: any[] = [];
  filteredBooks: any[] = [];
  searchQuery: string = '';
  userProfile: { username: string; avatar: string; role: string } | null = null;
  isAdmin: boolean = false;

  cart: { id: number; quantity: number }[] = [];
  cartCount: number = 0;
  wishlist: number[] = [];

  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);  
  constructor() {
    this.userProfile = this.authService.getUserProfile();
    this.isAdmin = this.userProfile?.role === 'admin';
  }

  ngOnInit() {
    this.bookService.getBooks().subscribe((res) => {
      this.books = res as any[];
      this.filteredBooks = this.books;

      localStorage.setItem('allBooks', JSON.stringify(this.books));

      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) this.wishlist = JSON.parse(storedWishlist);

      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        this.cartCount = this.cart.reduce((acc, item) => acc + item.quantity, 0);
      }

     
      this.route.queryParams.subscribe(params => {
        this.searchQuery = params['search'] || '';
        this.filterBooks();
      });
    });
  }

  filterBooks() {
    this.filteredBooks = this.searchQuery
      ? this.books.filter((book) =>
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.books;
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(() => {
      this.books = this.books.filter((b) => b.id !== id);
      this.filterBooks();
      this.removeFromWishlist(id);
      this.removeFromCart(id);
    });
  }

  logout() {
    if (!this.isAdmin) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your cart items will be removed upon logout.',
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
    } else {
      this.authService.logout();
      Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
    }
  }

  isWishlisted(bookId: number): boolean {
    return this.wishlist.includes(bookId);
  }

  toggleWishlist(bookId: number) {
    if (this.isWishlisted(bookId)) {
      this.wishlist = this.wishlist.filter((id) => id !== bookId);
    } else {
      this.wishlist.push(bookId);
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    localStorage.setItem('allBooks', JSON.stringify(this.books));
  }

  private removeFromWishlist(bookId: number) {
    this.wishlist = this.wishlist.filter((id) => id !== bookId);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  addToCart(book: any) {
    if (this.getAvailableStock(book.id) <= 0) {
      Swal.fire('Out of Stock', 'This book is currently out of stock.', 'error');
      return;
    }

    const existing = this.cart.find(item => item.id === book.id);
    if (!existing) {
      this.cart.push({ id: book.id, quantity: 1 });
    } else {
      existing.quantity++;
    }

    this.cartCount = this.cart.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private removeFromCart(bookId: number) {
    const index = this.cart.findIndex((item) => item.id === bookId);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.cartCount = this.cart.reduce((acc, item) => acc + item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  getAvailableStock(bookId: number): number {
    const cartItem = this.cart.find(item => item.id === bookId);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const book = this.books.find(b => b.id === bookId);
    if (!book) return 0;
    return book.stockQuantity - quantityInCart;
  }

  goToFavourites() {
    this.router.navigate(['/favourites']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
