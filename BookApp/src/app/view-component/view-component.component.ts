import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../services/book.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-view',
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
     <app-navbar></app-navbar>
    <!-- Error View -->
    <div class="container py-5" *ngIf="errorMessage; else bookContent">
      <div class="alert alert-danger text-center shadow-sm fs-5">
        {{ errorMessage }}
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-outline-secondary px-4 py-2" routerLink="/list">← Back to List</button>
      </div>
    </div>

    <!-- Book Details View -->
    <ng-template #bookContent>
      <div class="container py-5" *ngIf="book">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div class="card-body p-4">
                <h2 class="card-title text-center text-primary fw-bold mb-4">{{ book.title }}</h2>

                <div class="text-center mb-4">
                  <img
                    [src]="book.coverImageUrl"
                    alt="{{ book.title }}"
                    class="img-fluid rounded shadow"
                    style="max-height: 350px;"
                  />
                </div>

                <ul class="list-group list-group-flush fs-5 mb-4">
                  <li class="list-group-item"><strong>Author:</strong> {{ book.author }}</li>
                  <li class="list-group-item"><strong>Price:</strong> ₹{{ book.price }}</li>
                  <li class="list-group-item"><strong>Rating:</strong> {{ book.rating }} / 5</li>
                  <li class="list-group-item"><strong>Published Date:</strong> {{ book.publishedDate | date:'longDate' }}</li>
                </ul>

                <div class="text-center">
                  <button class="btn btn-outline-primary px-4 py-2" routerLink="/list">← Back to List</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ViewComponentComponent {
  book: any;
  errorMessage: string | null = null;

  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBookById(bookId).subscribe({
      next: (data) => {
        this.book = data;
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = err.error || 'You do not have permission to view this book.';
        } else if (err.status === 404) {
          this.errorMessage = 'Book not found.';
        } else {
          this.errorMessage = 'Something went wrong while fetching the book.';
        }
      }
    });
  }
}
