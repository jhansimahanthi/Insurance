import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Payment, PaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly API_URL = 'http://localhost:8084/api/payments';

  constructor(private http: HttpClient) {}

  processPayment(request: PaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(this.API_URL, request);
  }

  getPaymentById(id: number): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.API_URL}/${id}`);
  }

  getPaymentsByCustomer(customerId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Payment>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Payment>>>(`${this.API_URL}/customer/${customerId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getAllPayments(page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Payment>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Payment>>>(this.API_URL, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }
}
