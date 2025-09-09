import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-book-add',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <h2 class="text-center mb-4">Add Book</h2>

      <!-- Back Button -->
      <button class="btn btn-outline-secondary mb-4" (click)="goBack()">
        <i class="bi bi-arrow-left"></i> Back
      </button>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-4 shadow-sm">
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
          <input
            id="coverImageUrl"
            formControlName="coverImageUrl"
            type="text"
            class="form-control"
            placeholder="Paste an image URL"
          />
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
          <input
            id="rowVersion"
            formControlName="rowVersion"
            type="text"
            class="form-control"
            placeholder="e.g. AAAAAAAAABc="
          />
          <div class="form-text">This should be a base64-encoded row version (optional for new books).</div>
        </div>

        <div class="mb-3">
          <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">Add Book</button>
        </div>
      </form>
    </div>
  `,
})
export class AddComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publishedDate: ['', [Validators.required]],
    coverImageUrl: [''],
    price: [''],
    rating: [''],
    stockQuantity: ['', [Validators.required]],
    rowVersion: [''], // optional for new books, required for updates
  });

  submit() {
    if (this.form.invalid) return;

    const formValue = { ...this.form.value };

    // Convert date to ISO format if it's present
    if (formValue.publishedDate) {
      formValue.publishedDate = new Date(formValue.publishedDate).toISOString();
    }

    console.log('Payload to submit:', formValue);

    this.bookService.addBook(formValue).subscribe({
      next: () => this.router.navigate(['list']),
      error: (err) => {
        console.error('Error adding book:', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
        }
      },
    });
  }

  goBack() {
    this.router.navigate(['list']);
  }
}
