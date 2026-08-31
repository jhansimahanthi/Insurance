import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <div>
          <h1>Welcome back, {{ authService.currentUser()?.firstName }}! 👋</h1>
          <p class="text-muted">Here's an overview of your insurance portfolio</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-4">
        <div class="stat-card">
          <div class="stat-icon blue">📋</div>
          <div class="stat-value">{{ activePolicies }}</div>
          <div class="stat-label">Active Policies</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">📝</div>
          <div class="stat-value">{{ pendingClaims }}</div>
          <div class="stat-label">Pending Claims</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">🛡️</div>
          <div class="stat-value">\${{ totalCoverage | number }}</div>
          <div class="stat-label">Total Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">💳</div>
          <div class="stat-value">\${{ totalPremium | number }}</div>
          <div class="stat-label">Annual Premium</div>
        </div>
      </div>

      <!-- Recent Data -->
      <div class="grid grid-2" style="margin-top: 28px;">
        <div class="card">
          <div class="card-header">
            <h3>Recent Policies</h3>
            <a routerLink="/customer/purchases" class="view-all">View All →</a>
          </div>
          <div *ngIf="policies.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p>No policies yet</p>
            <a routerLink="/customer/policies" class="btn-primary btn-sm" style="margin-top: 12px;">Browse Policies</a>
          </div>
          <div class="data-list">
            <div class="data-item" *ngFor="let p of policies">
              <div class="data-info">
                <span class="data-icon">📋</span>
                <div>
                  <div class="data-title">{{ p.policyName }}</div>
                  <div class="data-sub">{{ p.policyType }} • \${{ p.premium }}/mo</div>
                </div>
              </div>
              <span class="badge badge-success">{{ p.status }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Recent Claims</h3>
            <a routerLink="/customer/claims" class="view-all">View All →</a>
          </div>
          <div *ngIf="claims.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <p>No claims submitted yet</p>
          </div>
          <div class="data-list">
            <div class="data-item" *ngFor="let c of claims">
              <div class="data-info">
                <span class="data-icon">📝</span>
                <div>
                  <div class="data-title">{{ c.claimNumber }}</div>
                  <div class="data-sub">{{ c.claimType }} • \${{ c.claimAmount | number }}</div>
                </div>
              </div>
              <span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card" style="margin-top: 28px;">
        <h3 style="margin-bottom: 16px;">Quick Actions</h3>
        <div class="quick-actions">
          <a routerLink="/customer/policies" class="action-card">
            <span class="action-icon">🔍</span>
            <span class="action-label">Browse Policies</span>
            <span class="action-desc">Explore insurance options</span>
          </a>
          <a routerLink="/customer/claims" class="action-card">
            <span class="action-icon">📝</span>
            <span class="action-label">Submit Claim</span>
            <span class="action-desc">File a new claim</span>
          </a>
          <a routerLink="/customer/purchases" class="action-card">
            <span class="action-icon">💳</span>
            <span class="action-label">My Policies</span>
            <span class="action-desc">View purchased policies</span>
          </a>
          <a routerLink="/customer/notifications" class="action-card">
            <span class="action-icon">🔔</span>
            <span class="action-label">Notifications</span>
            <span class="action-desc">View your alerts</span>
          </a>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .view-all { font-size: 13px; font-weight: 500; }
    .data-list { display: flex; flex-direction: column; }
    .data-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 0; border-bottom: 1px solid var(--border-light);
    }
    .data-item:last-child { border-bottom: none; }
    .data-info { display: flex; align-items: center; gap: 12px; }
    .data-icon { font-size: 1.25rem; width: 36px; height: 36px; border-radius: 8px; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; }
    .data-title { font-weight: 500; font-size: 14px; }
    .data-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .empty-state { text-align: center; padding: 32px 16px; color: var(--text-muted); }
    .empty-icon { font-size: 2.5rem; margin-bottom: 8px; opacity: 0.5; }
    .quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .action-card {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 24px 16px; background: var(--bg-primary); border-radius: var(--radius-lg);
      border: 1px solid var(--border); text-align: center; transition: all 0.2s;
    }
    .action-card:hover { border-color: var(--primary); background: var(--primary-50); transform: translateY(-2px); box-shadow: var(--shadow); }
    .action-icon { font-size: 1.75rem; }
    .action-label { font-weight: 600; font-size: 14px; color: var(--text-primary); }
    .action-desc { font-size: 12px; color: var(--text-muted); }
    @media (max-width: 768px) {
      .quick-actions { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  activePolicies = 0;
  pendingClaims = 0;
  totalCoverage = 0;
  totalPremium = 0;
  policies: any[] = [];
  claims: any[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

  constructor(
    public authService: AuthService,
    private policyService: PolicyService,
    private claimService: ClaimService
  ) {}

  ngOnInit() {
    const userId = this.authService.userId();
    if (userId) {
      this.policyService.getPurchasesByCustomer(userId).subscribe(res => {
        if (res.success && res.data) {
          this.policies = res.data.content || [];
          this.activePolicies = res.data.totalElements;
          this.totalCoverage = this.policies.reduce((sum, p) => sum + (p.premium || 0), 0) * 12;
          this.totalPremium = this.policies.reduce((sum, p) => sum + (p.premium || 0), 0);
        }
      });
      this.claimService.getClaimsByCustomer(userId).subscribe(res => {
        if (res.success && res.data) {
          this.claims = res.data.content || [];
          this.pendingClaims = this.claims.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': case 'SETTLED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      case 'UNDER_REVIEW': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}
