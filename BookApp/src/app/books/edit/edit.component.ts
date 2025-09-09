import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <h2 class="text-center">Edit Book</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm" *ngIf="form">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input id="title" formControlName="title" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="author" class="form-label">Author</label>
          <input id="author" formControlName="author" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="publishedDate" class="form-label">Published Date</label>
          <input id="publishedDate" formControlName="publishedDate" type="date" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="coverImageUrl" class="form-label">Cover Image URL</label>
          <input id="coverImageUrl" formControlName="coverImageUrl" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input id="price" formControlName="price" type="number" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="rating" class="form-label">Rating</label>
          <input id="rating" formControlName="rating" type="number" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="stockQuantity" class="form-label">Stock Quantity</label>
          <input id="stockQuantity" formControlName="stockQuantity" type="number" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="rowVersion" class="form-label">Row Version (base64)</label>
          <input id="rowVersion" formControlName="rowVersion" type="text" class="form-control" readonly />
          <div class="form-text">This value is used for concurrency control.</div>
        </div>

        <div class="mb-3">
          <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">Update Book</button>
        </div>
      </form>
    </div>
  `,
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private router = inject(Router);

  id!: number;

  form = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publishedDate: ['', [Validators.required]],
    coverImageUrl: [''],
    price: [''],
    rating: [''],
    stockQuantity: ['', [Validators.required]],
    rowVersion: [''] // Hidden from editing, but sent for concurrency
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBookById(this.id).subscribe((book: any) => {
      this.form.patchValue({
        title: book.title,
        author: book.author,
        publishedDate: book.publishedDate?.substring(0, 10),
        coverImageUrl: book.coverImageUrl || '',
        price: book.price,
        rating: book.rating,
        stockQuantity: book.stockQuantity,
        rowVersion: book.rowVersion // Base64 string (e.g. "AAAAAAAAB9E=")
      });
    });
  }

  submit() {
    if (this.form.invalid) return;

    const updatedBook = { ...this.form.value };

    // Convert publishedDate to ISO string if needed
    if (updatedBook.publishedDate) {
      updatedBook.publishedDate = new Date(updatedBook.publishedDate).toISOString();
    }

    this.bookService.updateBook(this.id, updatedBook).subscribe({
      next: () => this.router.navigate(['/list']),
      error: (err) => {
        console.error('Error updating book:', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
        }
      },
    });
  }
}
