import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-4">
        <div class="stat-card">
          <div class="stat-icon blue">👥</div>
          <div class="stat-value">{{ stats.totalCustomers || 0 }}</div>
          <div class="stat-label">Total Customers</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">📋</div>
          <div class="stat-value">{{ stats.activePolicies || 0 }}</div>
          <div class="stat-label">Active Policies</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">📝</div>
          <div class="stat-value">{{ stats.totalClaims || 0 }}</div>
          <div class="stat-label">Total Claims</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">⏳</div>
          <div class="stat-value">{{ stats.pendingClaims || 0 }}</div>
          <div class="stat-label">Pending Claims</div>
        </div>
      </div>

      <!-- Tables -->
      <div class="grid grid-2" style="margin-top: 28px;">
        <div class="card">
          <div class="card-header">
            <h3>Recent Claims</h3>
            <a routerLink="/admin/claims" class="view-all">View All →</a>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>Claim #</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of recentClaims">
                  <td><strong>{{ c.claimNumber }}</strong></td>
                  <td>\${{ c.claimAmount | number }}</td>
                  <td><span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span></td>
                </tr>
                <tr *ngIf="recentClaims.length === 0">
                  <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 24px;">No claims yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h3>Recent Policies</h3>
            <a routerLink="/admin/policies" class="view-all">View All →</a>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Premium</th></tr></thead>
              <tbody>
                <tr *ngFor="let p of recentPolicies">
                  <td><strong>{{ p.policyName }}</strong></td>
                  <td><span class="badge badge-info">{{ p.policyType }}</span></td>
                  <td>\${{ p.basePremium }}/mo</td>
                </tr>
                <tr *ngIf="recentPolicies.length === 0">
                  <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 24px;">No policies yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .view-all { font-size: 13px; font-weight: 500; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  recentClaims: any[] = [];
  recentPolicies: any[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

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
