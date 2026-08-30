import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Policy, PolicyPurchase, CreatePolicyRequest, PurchasePolicyRequest } from '../models/policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly API_URL = 'http://localhost:8082/api/policies';

  constructor(private http: HttpClient) {}

  getActivePolicies(page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Policy>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Policy>>>(`${this.API_URL}/active`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getAllPolicies(page = 0, size = 10, type?: string, status?: string): Observable<ApiResponse<PaginatedResponse<Policy>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (type) params = params.set('type', type);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PaginatedResponse<Policy>>>(this.API_URL, { params });
  }

  getPolicyById(id: number): Observable<ApiResponse<Policy>> {
    return this.http.get<ApiResponse<Policy>>(`${this.API_URL}/${id}`);
  }

  createPolicy(request: CreatePolicyRequest): Observable<ApiResponse<Policy>> {
    return this.http.post<ApiResponse<Policy>>(this.API_URL, request);
  }

  updatePolicy(id: number, request: Partial<CreatePolicyRequest> & { status?: string }): Observable<ApiResponse<Policy>> {
    return this.http.put<ApiResponse<Policy>>(`${this.API_URL}/${id}`, request);
  }

  deletePolicy(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  purchasePolicy(request: PurchasePolicyRequest): Observable<ApiResponse<PolicyPurchase>> {
    return this.http.post<ApiResponse<PolicyPurchase>>(`${this.API_URL}/purchase`, request);
  }

  getPurchases(page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<PolicyPurchase>>> {
    return this.http.get<ApiResponse<PaginatedResponse<PolicyPurchase>>>(`${this.API_URL}/purchases`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getPurchaseById(id: number): Observable<ApiResponse<PolicyPurchase>> {
    return this.http.get<ApiResponse<PolicyPurchase>>(`${this.API_URL}/purchases/${id}`);
  }

  getPurchasesByCustomer(customerId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<PolicyPurchase>>> {
    return this.http.get<ApiResponse<PaginatedResponse<PolicyPurchase>>>(`${this.API_URL}/purchases/customer/${customerId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }
}
