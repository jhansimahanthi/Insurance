import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item active">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/customer/purchases" class="nav-item">🛒 My Policies</a>
          <a routerLink="/customer/quotes" class="nav-item">💰 Quotes</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
          <a routerLink="/customer/notifications" class="nav-item">🔔 Notifications</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Welcome, {{ authService.currentUser()?.firstName }}!</h1>
            <p class="text-muted">Here's an overview of your insurance portfolio</p>
          </div>
        </div>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-value">{{ activePolicies }}</div>
            <div class="stat-label">Active Policies</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ pendingClaims }}</div>
            <div class="stat-label">Pending Claims</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">\${{ totalCoverage | number }}</div>
            <div class="stat-label">Total Coverage</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">\${{ totalPremium | number }}</div>
            <div class="stat-label">Annual Premium</div>
          </div>
        </div>
        <div class="grid grid-2" style="margin-top: 24px;">
          <div class="card">
            <h3>Recent Policies</h3>
            <div *ngIf="policies.length === 0" class="empty-state">
              <p>No policies yet. <a routerLink="/customer/policies">Browse policies</a> to get started.</p>
            </div>
            <div class="policy-list">
              <div class="policy-item" *ngFor="let p of policies">
                <div>
                  <strong>{{ p.policyName }}</strong>
                  <span class="text-muted"> • {{ p.policyType }}</span>
                </div>
                <span class="badge badge-success">{{ p.status }}</span>
              </div>
            </div>
          </div>
          <div class="card">
            <h3>Recent Claims</h3>
            <div *ngIf="claims.length === 0" class="empty-state">
              <p>No claims submitted yet.</p>
            </div>
            <div class="policy-list">
              <div class="policy-item" *ngFor="let c of claims">
                <div>
                  <strong>{{ c.claimNumber }}</strong>
                  <span class="text-muted"> • {{ c.claimType }}</span>
                </div>
                <span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top: 24px;">
          <h3>Quick Actions</h3>
          <div class="quick-actions">
            <a routerLink="/customer/policies" class="action-card">
              <span class="action-icon">📋</span>
              <span>Browse Policies</span>
            </a>
            <a routerLink="/customer/claims" class="action-card">
              <span class="action-icon">📝</span>
              <span>Submit Claim</span>
            </a>
            <a routerLink="/customer/purchases" class="action-card">
              <span class="action-icon">💳</span>
              <span>View Payments</span>
            </a>
            <a routerLink="/customer/notifications" class="action-card">
              <span class="action-icon">🔔</span>
              <span>Notifications</span>
            </a>
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
    .nav-item:hover { background: var(--bg-primary); color: var(--text-primary); }
    .nav-item.active { background: #dbeafe; color: var(--primary); font-weight: 500; }
    .main-content { flex: 1; padding: 32px; }
    .policy-list { margin-top: 16px; }
    .policy-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .policy-item:last-child { border-bottom: none; }
    .empty-state { text-align: center; padding: 24px; color: var(--text-muted); }
    .quick-actions { display: flex; gap: 16px; margin-top: 16px; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; background: var(--bg-primary); border-radius: var(--radius-lg); border: 1px solid var(--border); flex: 1; text-align: center; transition: all 0.2s; }
    .action-card:hover { border-color: var(--primary); background: #eff6ff; }
    .action-icon { font-size: 1.5rem; }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .quick-actions { flex-wrap: wrap; }
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
