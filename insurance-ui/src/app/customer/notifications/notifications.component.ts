import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/customer/purchases" class="nav-item">🛒 My Policies</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
          <a routerLink="/customer/notifications" class="nav-item active">🔔 Notifications</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>Notifications</h1>
          <button class="btn-secondary btn-sm" (click)="markAllRead()">Mark all as read</button>
        </div>
        <div class="notifications-list">
          <div class="notification-item card" *ngFor="let n of notifications" [class.unread]="!n.read" (click)="markRead(n)">
            <div class="notif-icon" [ngClass]="getNotifClass(n.type)">{{ getNotifEmoji(n.type) }}</div>
            <div class="notif-content">
              <h4>{{ n.title }}</h4>
              <p>{{ n.message }}</p>
              <span class="text-muted" style="font-size: 12px;">{{ n.createdAt | date:'medium' }}</span>
            </div>
          </div>
          <div *ngIf="notifications.length === 0" class="card" style="text-align: center; padding: 48px;">
            <p class="text-muted">No notifications yet.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: calc(100vh - 64px); }
    .sidebar { width: 240px; background: white; border-right: 1px solid var(--border); padding: 24px 0; position: sticky; top: 64px; height: calc(100vh - 64px); }
    .sidebar-brand { padding: 0 24px 24px; font-size: 1.1rem; font-weight: 700; color: var(--primary); border-bottom: 1px solid var(--border); }
    .sidebar-nav { padding: 12px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--radius); color: var(--text-secondary); font-size: 14px; margin-bottom: 4px; }
    .nav-item:hover { background: var(--bg-primary); }
    .nav-item.active { background: #dbeafe; color: var(--primary); font-weight: 500; }
    .main-content { flex: 1; padding: 32px; }
    .notification-item { display: flex; gap: 16px; padding: 16px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
    .notification-item.unread { border-left: 3px solid var(--primary); background: #f8faff; }
    .notif-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .notif-icon.success { background: #dcfce7; }
    .notif-icon.info { background: #dbeafe; }
    .notif-icon.warning { background: #fef3c7; }
    .notif-icon.error { background: #fee2e2; }
    .notif-content h4 { font-size: 14px; margin-bottom: 4px; }
    .notif-content p { font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; }
    @media (max-width: 768px) { .sidebar { display: none; } }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  constructor(private authService: AuthService, private notificationService: NotificationService) {}
  ngOnInit() { this.load(); }
  load() {
    this.notificationService.getNotifications(this.authService.userId()).subscribe(res => {
      if (res.success && res.data) this.notifications = res.data.content;
    });
  }
  markRead(n: Notification) {
    if (!n.read) { this.notificationService.markAsRead(n.id, this.authService.userId()).subscribe(() => n.read = true); }
  }
  markAllRead() { this.notificationService.markAllAsRead(this.authService.userId()).subscribe(() => this.load()); }
  getNotifClass(type: string): string { return type?.toLowerCase() || 'info'; }
  getNotifEmoji(type: string): string { return ({ SUCCESS: '✅', INFO: 'ℹ️', WARNING: '⚠️', ERROR: '❌' } as Record<string, string>)[type] || 'ℹ️'; }
}
