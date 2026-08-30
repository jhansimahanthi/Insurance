import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API_URL = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/dashboard`);
  }

  getCustomers(page = 0, size = 10, search?: string): Observable<ApiResponse<PaginatedResponse<User>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(`${this.API_URL}/customers`, { params });
  }

  getCustomerById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/customers/${id}`);
  }

  updateCustomer(id: number, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/customers/${id}`, data);
  }

  updateCustomerStatus(id: number, status: string): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/customers/${id}/status`, null, {
      params: new HttpParams().set('status', status)
    });
  }
}
