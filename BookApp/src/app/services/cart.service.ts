import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface CartItem {
  bookId: number;
  quantity: number;
  title?: string;
  coverImageUrl?: string;
  price?: number;
}

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

interface CheckoutItemDto {
  bookId: number;
  stockQuantity: number;  // <-- must match backend DTO property name
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://localhost:7153/api/Cart';
  private checkoutUrl = 'https://localhost:7153/api/Cart/Checkout';

  constructor(private http: HttpClient) {}

  loadInitialData(userId: number): void {
    this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`)
      .pipe(tap(items => localStorage.setItem('cart', JSON.stringify(items))))
      .subscribe();
  }

  addToCart(userId: number, book: Book) {
    this.syncAddToLocalStorage(book.id, 1);
    return this.http.post(this.apiUrl, { userId, bookId: book.id, quantity: 1 });
  }

  updateQuantity(userId: number, bookId: number, quantity: number) {
    this.syncUpdateLocalStorage(bookId, quantity);
    return this.http.put(this.apiUrl, { userId, bookId, quantity });
  }

  removeFromCart(userId: number, bookId: number) {
    this.syncRemoveFromLocalStorage(bookId);
    return this.http.request('DELETE', this.apiUrl, { body: { userId, bookId } });
  }

  // Fix checkout method to match backend expectations
  checkout(userId: string, items: { bookId: number; quantity: number }[]) {
    // Map frontend quantity to backend's stockQuantity
    const payload = {
      userId,
      items: items.map(item => ({
        bookId: item.bookId,
        stockQuantity: item.quantity
      }))
    };
    return this.http.post(this.checkoutUrl, payload);
  }

  // LocalStorage Sync Helpers
  private syncAddToLocalStorage(bookId: number, amount: number): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(c => c.bookId === bookId);
    if (item) {
      item.quantity += amount;
    } else {
      cart.push({ bookId, quantity: amount });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private syncUpdateLocalStorage(bookId: number, quantity: number): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(c => c.bookId === bookId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  private syncRemoveFromLocalStorage(bookId: number): void {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(c => c.bookId !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
