// // src/app/components/add-to-cart-button/add-to-cart-button.component.ts
// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-add-to-cart-button',
//   template: `
//     <button
//       class="btn btn-outline-success btn-sm shadow-sm"
//       (click)="addToCart()"
//       title="Add to Cart"
//     >
//       Add to Cart
//     </button>
//   `,
//   standalone: true,
// })
// export class AddToCartComponent {
//   @Input() book: any;

//   // addToCart() {
//   //   if (!this.book) return;

//   //   let cart: any[] = [];

//   //   const storedCart = localStorage.getItem('cart');
//   //   if (storedCart) {
//   //     cart = JSON.parse(storedCart);
//   //   }

//   //   if (!cart.find((item) => item.id === this.book.id)) {
//   //     cart.push(this.book);
//   //     localStorage.setItem('cart', JSON.stringify(cart));
//   //     alert(`${this.book.title} added to cart!`);
//   //   } else {
//   //     alert(`${this.book.title} is already in the cart.`);
//   //   }
//   // }
//   addToCart() {
//   if (!this.book) return;

//   let cart: { book: any; quantity: number }[] = [];

//   const storedCart = localStorage.getItem('cart');
//   if (storedCart) {
//     cart = JSON.parse(storedCart);
//   }

//   const existingItem = cart.find((item) => item.book.id === this.book.id);

//   if (existingItem) {
//     existingItem.quantity++;
//   } else {
//     cart.push({ book: this.book, quantity: 1 });
//   }

//   localStorage.setItem('cart', JSON.stringify(cart));
//   alert(`${this.book.title} added to cart!`);
// }

// }
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  template: `
    <button class="btn btn-primary btn-sm shadow-sm" (click)="addToCart()">
      Add to Cart
    </button>
  `,
  styles: [
    `
      button {
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #0b5ed7;
      }
    `,
  ],
})
export class AddToCartComponent {
  @Input() book: any;
  @Output() addedToCart = new EventEmitter<void>();

  addToCart() {
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find((item: any) => item.book.id === this.book.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ book: this.book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.addedToCart.emit();
    alert(`"${this.book.title}" added to cart!`);
  }
}
