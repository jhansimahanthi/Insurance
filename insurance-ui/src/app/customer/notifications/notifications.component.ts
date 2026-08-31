import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <h1>Notifications</h1>
        <button class="btn-secondary btn-sm" (click)="markAllRead()" *ngIf="notifications.length > 0">Mark all as read</button>
      </div>

      <div class="notifications-list">
        <div class="notification-item card" *ngFor="let n of notifications"
             [class.unread]="!n.read" (click)="markRead(n)">
          <div class="notif-icon" [ngClass]="getNotifClass(n.type)">{{ getNotifEmoji(n.type) }}</div>
          <div class="notif-content">
            <h4>{{ n.title }}</h4>
            <p>{{ n.message }}</p>
            <span class="text-muted" style="font-size: 12px;">{{ n.createdAt | date:'medium' }}</span>
          </div>
          <span *ngIf="!n.read" class="unread-dot"></span>
        </div>

        <!-- Empty State -->
        <div *ngIf="notifications.length === 0" class="card empty-state">
          <div class="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p class="text-muted" style="margin-top: 8px;">You'll see notifications here when there are updates to your policies, claims, and payments.</p>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .notification-item {
      display: flex; gap: 16px; padding: 18px 20px; margin-bottom: 8px;
      cursor: pointer; transition: all 0.15s; align-items: flex-start;
    }
    .notification-item:hover { border-color: #cbd5e1; }
    .notification-item.unread { border-left: 3px solid var(--primary); background: #f8faff; }
    .notif-icon {
      width: 42px; height: 42px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;
    }
    .notif-icon.success { background: #dcfce7; }
    .notif-icon.info { background: #dbeafe; }
    .notif-icon.warning { background: #fef3c7; }
    .notif-icon.error { background: #fee2e2; }
    .notif-content { flex: 1; min-width: 0; }
    .notif-content h4 { font-size: 14px; margin-bottom: 4px; }
    .notif-content p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 6px; }
    .empty-state { text-align: center; padding: 64px 24px; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.4; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

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
