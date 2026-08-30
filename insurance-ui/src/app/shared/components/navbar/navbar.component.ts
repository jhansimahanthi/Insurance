import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-content">
        <a routerLink="/" class="brand">🛡️ InsurePro</a>
        <div class="nav-links" *ngIf="!authService.isAuthenticated()">
          <a routerLink="/customer/policies">Policies</a>
          <a routerLink="/login" class="btn-primary btn-sm">Sign In</a>
          <a routerLink="/register" class="btn-secondary btn-sm">Sign Up</a>
        </div>
        <div class="nav-links" *ngIf="authService.isAuthenticated() && !authService.isAdmin()">
          <a routerLink="/customer/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/customer/policies" routerLinkActive="active">Policies</a>
          <a routerLink="/customer/purchases" routerLinkActive="active">My Policies</a>
          <a routerLink="/customer/claims" routerLinkActive="active">Claims</a>
          <a routerLink="/customer/notifications" routerLinkActive="active" class="notif-link">
            🔔 <span *ngIf="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
          </a>
          <div class="user-menu">
            <span class="user-name">{{ authService.currentUser()?.firstName }}</span>
            <button class="btn-secondary btn-sm" (click)="authService.logout()">Logout</button>
          </div>
        </div>
        <div class="nav-links" *ngIf="authService.isAdmin()">
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/customers" routerLinkActive="active">Customers</a>
          <a routerLink="/admin/policies" routerLinkActive="active">Policies</a>
          <a routerLink="/admin/claims" routerLinkActive="active">Claims</a>
          <div class="user-menu">
            <span class="badge badge-info">Admin</span>
            <button class="btn-secondary btn-sm" (click)="authService.logout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: white; border-bottom: 1px solid var(--border); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
    .nav-content { display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .brand { font-size: 1.25rem; font-weight: 700; color: var(--primary); }
    .nav-links { display: flex; align-items: center; gap: 20px; }
    .nav-links a { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
    .nav-links a.active { color: var(--primary); }
    .user-menu { display: flex; align-items: center; gap: 12px; margin-left: 12px; padding-left: 12px; border-left: 1px solid var(--border); }
    .user-name { font-size: 13px; font-weight: 500; }
    .notif-link { position: relative; }
    .notif-badge { position: absolute; top: -8px; right: -8px; background: var(--danger); color: white; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  `]
})
export class NavbarComponent {
  unreadCount = 0;
  constructor(public authService: AuthService) {}
}
