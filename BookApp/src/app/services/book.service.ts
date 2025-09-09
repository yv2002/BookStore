import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Book {
  id: number;
  title: string;
  price: number;
  coverImageUrl: string;
  stockQuantity: number;
  author: string,
  publishedDate:Date ,
  rating:number,
  rowVersion:string, 

}
@Injectable({ providedIn: 'root' })

export class BookService {
  private apiUrl = 'https://localhost:7153/api/Books';

  constructor(private http: HttpClient) {}

 getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }
   getBookById(id: number) {
  return this.http.get(`${this.apiUrl}/${id}`);
}

  addBook(book: any) {
    return this.http.post(this.apiUrl, book);
  }

  updateBook(id: number, book: any) {
    return this.http.put(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
