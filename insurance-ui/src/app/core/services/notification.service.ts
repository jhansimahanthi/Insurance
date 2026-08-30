import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = 'http://localhost:8086/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedResponse<Notification>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Notification>>>(`${this.API_URL}/user/${userId}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getUnreadCount(userId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}/user/${userId}/unread-count`);
  }

  markAsRead(id: number, userId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API_URL}/${id}/read`, null, {
      params: new HttpParams().set('userId', userId)
    });
  }

  markAllAsRead(userId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API_URL}/user/${userId}/read-all`, null);
  }
}
