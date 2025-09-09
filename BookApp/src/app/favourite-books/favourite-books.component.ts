// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// @Component({
//   standalone: true,
//   selector: 'app-favourite-books',
//   imports: [CommonModule],
//   template: `
//     <div class="container mt-5">
//       <h2>Favourite Books</h2>
//       <button class="btn btn-secondary mb-3" (click)="goBack()">Back to Book List</button>

//       <div class="row">
//         <div class="col-md-4 mb-4" *ngFor="let book of favouriteBooks">
//           <div class="card h-100 shadow-sm">
//             <img
//               [src]="book.coverImageUrl"
//               class="card-img-top"
//               alt="{{ book.title }}"
//               style="height: 250px; object-fit: cover;"
//             />
//             <div class="card-body">
//               <h5 class="card-title">{{ book.title }}</h5>
//               <p class="card-text"><strong>Author:</strong> {{ book.author }}</p>
//               <p class="card-text">
//                 <strong>Published:</strong> {{ book.publishedDate | date: 'shortDate' }}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div *ngIf="favouriteBooks.length === 0" class="alert alert-info">
//         No favourite books added yet.
//       </div>
//     </div>
//   `,
// })
// export class FavouriteBooksComponent {
//   favouriteBooks: any[] = [];
//   private router = inject(Router);

//   ngOnInit() {
//     const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
//     const allBooks = JSON.parse(localStorage.getItem('allBooks') || '[]'); // or fetch from service if available

//     // Filter only favourite books from all books by IDs in wishlist
//     this.favouriteBooks = allBooks.filter((book: any) => wishlistIds.includes(book.id));
//   }

//   goBack() {
//     this.router.navigate(['/list']);
//   }
// }
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-favourite-books',
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2>Favourite Books</h2>
      <button class="btn btn-secondary mb-3" (click)="goBack()">Back to Book List</button>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let book of favouriteBooks">
          <div class="card h-100 shadow-sm">
            <img
              [src]="book.coverImageUrl"
              class="card-img-top"
              alt="{{ book.title }}"
              style="height: 250px; object-fit: cover;"
            />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text"><strong>Author:</strong> {{ book.author }}</p>
              <p class="card-text">
                <strong>Published:</strong> {{ book.publishedDate | date: 'shortDate' }}
              </p>
              <button class="btn btn-danger" (click)="removeFromWishlist(book.id)">
                Remove from Favourites
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="favouriteBooks.length === 0" class="alert alert-info">
        No favourite books added yet.
      </div>
    </div>
  `,
})
export class FavouriteBooksComponent {
  favouriteBooks: any[] = [];
  private router = inject(Router);

  ngOnInit() {
    this.loadFavourites();
  }

  loadFavourites() {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const allBooks = JSON.parse(localStorage.getItem('allBooks') || '[]');
    this.favouriteBooks = allBooks.filter((book: any) => wishlistIds.includes(book.id));
  }

  removeFromWishlist(bookId: number) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter((id: number) => id !== bookId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    this.loadFavourites(); 
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
