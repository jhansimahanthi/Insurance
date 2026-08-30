import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Claim, SubmitClaimRequest, UpdateClaimStatusRequest } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly API_URL = 'http://localhost:8085/api/claims';

  constructor(private http: HttpClient) {}

  submitClaim(request: SubmitClaimRequest): Observable<ApiResponse<Claim>> {
    return this.http.post<ApiResponse<Claim>>(this.API_URL, request);
  }

  getClaimById(id: number): Observable<ApiResponse<Claim>> {
    return this.http.get<ApiResponse<Claim>>(`${this.API_URL}/${id}`);
  }

  getClaimsByCustomer(customerId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Claim>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Claim>>>(`${this.API_URL}/customer/${customerId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getAllClaims(page = 0, size = 10, status?: string): Observable<ApiResponse<PaginatedResponse<Claim>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PaginatedResponse<Claim>>>(this.API_URL, { params });
  }

  updateClaimStatus(id: number, request: UpdateClaimStatusRequest): Observable<ApiResponse<Claim>> {
    return this.http.put<ApiResponse<Claim>>(`${this.API_URL}/${id}/status`, request);
  }
}
