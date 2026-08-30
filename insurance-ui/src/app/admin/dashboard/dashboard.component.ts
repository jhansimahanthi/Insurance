import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro <span class="badge badge-info">Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item active">📊 Dashboard</a>
          <a routerLink="/admin/customers" class="nav-item">👥 Customers</a>
          <a routerLink="/admin/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/admin/quotes" class="nav-item">💰 Quotes</a>
          <a routerLink="/admin/purchases" class="nav-item">🛒 Purchases</a>
          <a routerLink="/admin/payments" class="nav-item">💳 Payments</a>
          <a routerLink="/admin/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
        </div>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalCustomers || 0 }}</div>
            <div class="stat-label">Total Customers</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.activePolicies || 0 }}</div>
            <div class="stat-label">Active Policies</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalClaims || 0 }}</div>
            <div class="stat-label">Total Claims</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.pendingClaims || 0 }}</div>
            <div class="stat-label">Pending Claims</div>
          </div>
        </div>
        <div class="grid grid-2" style="margin-top: 24px;">
          <div class="card">
            <h3>Recent Claims</h3>
            <div class="table-container" style="margin-top: 12px;">
              <table>
                <thead><tr><th>Claim #</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr *ngFor="let c of recentClaims">
                    <td>{{ c.claimNumber }}</td>
                    <td>\${{ c.claimAmount | number }}</td>
                    <td><span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card">
            <h3>Recent Policies</h3>
            <div class="table-container" style="margin-top: 12px;">
              <table>
                <thead><tr><th>Name</th><th>Type</th><th>Premium</th></tr></thead>
                <tbody>
                  <tr *ngFor="let p of recentPolicies">
                    <td>{{ p.policyName }}</td>
                    <td><span class="badge badge-info">{{ p.policyType }}</span></td>
                    <td>\${{ p.basePremium }}/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: calc(100vh - 64px); }
    .sidebar { width: 240px; background: white; border-right: 1px solid var(--border); padding: 24px 0; position: sticky; top: 64px; height: calc(100vh - 64px); }
    .sidebar-brand { padding: 0 24px 24px; font-size: 1.1rem; font-weight: 700; color: var(--primary); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
    .sidebar-nav { padding: 12px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--radius); color: var(--text-secondary); font-size: 14px; margin-bottom: 4px; }
    .nav-item:hover { background: var(--bg-primary); }
    .nav-item.active { background: #dbeafe; color: var(--primary); font-weight: 500; }
    .main-content { flex: 1; padding: 32px; }
    @media (max-width: 768px) { .sidebar { display: none; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  recentClaims: any[] = [];
  recentPolicies: any[] = [];

  constructor(private adminService: AdminService, private policyService: PolicyService, private claimService: ClaimService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe(res => {
      if (res.success) this.stats = res.data || {};
    });
    this.policyService.getAllPolicies(0, 5).subscribe(res => {
      if (res.success && res.data) this.recentPolicies = res.data.content;
    });
    this.claimService.getAllClaims(0, 5).subscribe(res => {
      if (res.success && res.data) this.recentClaims = res.data.content;
    });
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
