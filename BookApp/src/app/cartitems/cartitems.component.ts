import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../services/cart.service';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  price: number;
  coverImageUrl: string;
  stockQuantity: number;
  author: string;
  publishedDate: Date;
  rating: number;
  rowVersion: string;
}

interface CartItem {
  id: number;
  quantity: number;
  selected?: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="d-flex align-items-center gap-2">
          <i class="bi bi-cart3 fs-2 text-primary"></i> Your Cart
        </h2>
        <button class="btn btn-secondary" (click)="goBack()">← Back to List</button>
      </div>

      <div *ngIf="cart.length === 0" class="alert alert-info text-center fs-5">
        Your cart is empty.
      </div>

      <ul class="list-group" *ngIf="cart.length > 0">
        <li
          class="list-group-item d-flex align-items-center justify-content-between gap-3"
          *ngFor="let book of cart; let i = index"
        >
          <div class="form-check me-3">
            <input type="checkbox" [(ngModel)]="book.selected" class="form-check-input" />
          </div>

          <div class="d-flex align-items-center gap-3 flex-grow-1">
            <img [src]="book.coverImageUrl" alt="{{ book.title }}" class="cart-book-img" />
            <div>
              <h5 class="mb-1 text-primary">{{ book.title }}</h5>
              <p class="mb-1 text-muted"><strong>Author:</strong> {{ book.author }}</p>
              <p class="mb-0 fw-semibold">Price: ₹{{ book.price }}</p>

              <div class="input-group mt-2" style="width: 120px;">
                <button
                  class="btn btn-outline-secondary btn-sm"
                  (click)="decreaseQuantity(i)"
                  [disabled]="book.quantity <= 1"
                >
                  −
                </button>
                <input type="number" class="form-control text-center" [value]="book.quantity" readonly />
                <button class="btn btn-outline-secondary btn-sm" (click)="increaseQuantity(i)">+</button>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-success btn-sm" (click)="buyNow(book)">Buy Now</button>
            <button class="btn btn-danger btn-sm" (click)="removeFromCart(book.id)">Remove</button>
          </div>
        </li>
      </ul>

      <div class="mt-4 d-flex justify-content-between align-items-center" *ngIf="cart.length > 0">
        <div>
          Selected Books: {{ getSelectedBooks().length }} |
          Total Price: ₹{{ getSelectedTotalPrice() }}
        </div>
        <button class="btn btn-primary" (click)="checkout()">Checkout</button>
      </div>
    </div>
  `,
  styles: [
    `
      .cart-book-img {
        width: 70px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
      }
    `,
  ],
})
export class CartItemsComponent {
  cart: (Book & { quantity: number; selected: boolean })[] = [];

  private cartService = inject(CartService);
  private bookService = inject(BookService);
  private router = inject(Router);
  
  // Keep your userId here; use string type as per CartService
  private userId = '1'; // Replace with actual logged-in user ID logic

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const storedCart = localStorage.getItem('cart');
    const cartItems: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    this.bookService.getBooks().subscribe((books: Book[]) => {
      this.cart = cartItems.map((item) => {
        const book = books.find((b) => b.id === item.id);
        if (book) {
          return {
            ...book,
            quantity: item.quantity ?? 1,
            selected: item.selected ?? false,
          };
        }
        return {
          id: item.id,
          quantity: item.quantity ?? 1,
          selected: item.selected ?? false,
          coverImageUrl: '',
          title: 'Unknown book',
          author: 'Unknown',
          price: 0,
          stockQuantity: 0,
          publishedDate: new Date(),
          rating: 0,
          rowVersion: '',
        };
      });
    });
  }

  saveCart() {
    const toSave: CartItem[] = this.cart.map(({ id, quantity, selected }) => ({
      id,
      quantity,
      selected,
    }));
    localStorage.setItem('cart', JSON.stringify(toSave));
  }

  removeFromCart(bookId: number) {
    this.cart = this.cart.filter((b) => b.id !== bookId);
    this.saveCart();
  }

  increaseQuantity(index: number) {
    const book = this.cart[index];
    if (book.quantity >= book.stockQuantity) {
      Swal.fire('Stock Limit', 'Cannot exceed available stock.', 'info');
      return;
    }
    book.quantity++;
    this.saveCart();
  }

  decreaseQuantity(index: number) {
    const book = this.cart[index];
    if (book.quantity > 1) {
      book.quantity--;
      this.saveCart();
    }
  }

  getSelectedBooks() {
    return this.cart.filter((book) => book.selected);
  }

  getSelectedTotalPrice(): number {
    return this.getSelectedBooks().reduce(
      (sum, book) => sum + book.price * book.quantity,
      0
    );
  }

 buyNow(book: Book & { quantity: number }) {
  Swal.fire({
    title: `Buy "${book.title}"?`,
    text: `Total: ₹${book.price * book.quantity}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Buy Now',
  }).then((result) => {
    if (result.isConfirmed) {
      // Call CartService checkout for single book purchase
      this.cartService
        .checkout(this.userId, [{ bookId: book.id, quantity: book.quantity }])
        .subscribe({
          next: () => {
            Swal.fire('Success', `Purchased "${book.title}"!`, 'success');
            // Remove from local cart array and localStorage
            this.removeFromCart(book.id);
          },
          error: (err) => {
            console.error('Error during purchase:', err);
            Swal.fire('Error', err.error?.message || 'Purchase failed.', 'error');
          },
        });
    }
  });
}



  // *** Only changed checkout method ***
  checkout() {
    const items = this.cart
      .filter((book) => book.selected)
      .map((book) => ({
        bookId: book.id,
        quantity: book.quantity,
      }));

    if (items.length === 0) {
      Swal.fire('Info', 'Please select at least one book to checkout.', 'info');
      return;
    }

    // Pass userId (string) + items as required by updated CartService
    this.cartService.checkout(this.userId, items).subscribe({
      next: () => {
        Swal.fire('Success', 'Checkout completed successfully!', 'success');
        this.cart = this.cart.filter((book) => !book.selected);
        this.saveCart();
      },
      error: (err) => {
        console.error('Checkout error:', err);
        Swal.fire('Error', err.error?.message || 'Checkout failed.', 'error');
      },
    });
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
