import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Quote, CreateQuoteRequest } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly API_URL = 'http://localhost:8083/api/quotes';

  constructor(private http: HttpClient) {}

  generateQuote(request: CreateQuoteRequest): Observable<ApiResponse<Quote>> {
    return this.http.post<ApiResponse<Quote>>(this.API_URL, request);
  }

  getQuoteById(id: number): Observable<ApiResponse<Quote>> {
    return this.http.get<ApiResponse<Quote>>(`${this.API_URL}/${id}`);
  }

  getQuotesByCustomer(customerId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Quote>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Quote>>>(`${this.API_URL}/customer/${customerId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getAllQuotes(page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Quote>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Quote>>>(this.API_URL, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }
}
