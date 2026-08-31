import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile header -->
    <div class="mobile-header" (click)="sidebarOpen = !sidebarOpen">
      <span class="mobile-brand">🛡️ InsurePro</span>
      <button class="hamburger" [class.open]="sidebarOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Overlay -->
    <div class="sidebar-overlay" [class.visible]="sidebarOpen" (click)="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="sidebar" [class.open]="sidebarOpen">
      <div class="sidebar-brand">
        <span>🛡️ InsurePro</span>
        <span *ngIf="isAdmin" class="badge badge-info">Admin</span>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of items"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           (click)="sidebarOpen = false">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <ng-content></ng-content>
    </main>
  `,
  styles: [`
    :host { display: flex; min-height: calc(100vh - 64px); }

    /* Mobile header */
    .mobile-header {
      display: none;
      position: fixed; top: 64px; left: 0; right: 0; z-index: 90;
      background: white; border-bottom: 1px solid var(--border);
      padding: 12px 20px; align-items: center; justify-content: space-between;
    }
    .mobile-brand { font-weight: 700; color: var(--primary); }
    .hamburger {
      background: none; border: none; cursor: pointer; padding: 4px;
      display: flex; flex-direction: column; gap: 5px;
    }
    .hamburger span {
      display: block; width: 22px; height: 2px; background: var(--text-primary);
      transition: all 0.3s ease; border-radius: 2px;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    /* Overlay */
    .sidebar-overlay {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      z-index: 95; opacity: 0; transition: opacity 0.3s;
    }

    /* Sidebar */
    .sidebar {
      width: 260px; background: white; border-right: 1px solid var(--border);
      padding: 28px 0; position: sticky; top: 64px; height: calc(100vh - 64px);
      overflow-y: auto; flex-shrink: 0;
    }
    .sidebar-brand {
      padding: 0 24px 24px; font-size: 1.1rem; font-weight: 700; color: var(--primary);
      border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px;
    }
    .sidebar-nav { padding: 16px 12px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 11px 16px;
      border-radius: var(--radius); color: var(--text-secondary); font-size: 14px;
      margin-bottom: 2px; font-weight: 450; transition: all 0.15s;
    }
    .nav-item:hover { background: var(--bg-primary); color: var(--text-primary); }
    .nav-item.active { background: #dbeafe; color: var(--primary); font-weight: 600; }
    .nav-icon { font-size: 1.1rem; width: 24px; text-align: center; flex-shrink: 0; }

    /* Main content */
    .main-content { flex: 1; padding: 32px; min-width: 0; }

    /* Mobile responsive */
    @media (max-width: 768px) {
      :host { flex-direction: column; }
      .mobile-header { display: flex; }
      .sidebar-overlay.visible { display: block; opacity: 1; }
      .sidebar {
        position: fixed; top: 64px; left: -280px; bottom: 0; z-index: 100;
        transition: left 0.3s ease; box-shadow: var(--shadow-lg);
      }
      .sidebar.open { left: 0; }
      .main-content { padding: 20px 16px; padding-top: 72px; }
    }
  `]
})
export class SidebarLayoutComponent {
  @Input() items: SidebarItem[] = [];
  @Input() isAdmin = false;
  sidebarOpen = false;
}
