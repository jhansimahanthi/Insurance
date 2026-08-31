import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { Policy } from '../../core/models/policy.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <h1>Insurance Policies</h1>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <button *ngFor="let t of policyTypes" class="filter-btn" [class.active]="selectedType === t.value"
                (click)="filterByType(t.value)">{{ t.label }}</button>
      </div>

      <!-- Policy Grid -->
      <div class="grid grid-3" style="margin-top: 24px;">
        <div class="policy-card card" *ngFor="let policy of policies">
          <div class="policy-top">
            <span class="policy-icon">{{ getIcon(policy.policyType) }}</span>
            <span class="badge badge-info">{{ policy.policyType }}</span>
          </div>
          <h3 class="policy-name">{{ policy.policyName }}</h3>
          <p class="policy-desc">{{ policy.description }}</p>
          <div class="policy-meta">
            <div class="meta-item">
              <span class="meta-label">Coverage</span>
              <span class="meta-value">\${{ policy.coverageAmount | number }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Premium</span>
              <span class="meta-value">\${{ policy.basePremium }}/mo</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Duration</span>
              <span class="meta-value">{{ policy.duration }} months</span>
            </div>
          </div>
          <a [routerLink]="['/customer/policies', policy.id]" class="btn-primary btn-block" style="margin-top: 18px;">View Details</a>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="policies.length === 0 && !loading" class="empty-state card">
        <div class="empty-icon">📋</div>
        <h3>No policies found</h3>
        <p class="text-muted" style="margin-top: 8px;">No insurance policies match your current filter.</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="text-muted">Loading policies...</p>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn {
      padding: 8px 18px; border: 1px solid var(--border); border-radius: 9999px;
      background: white; font-size: 13px; cursor: pointer; transition: all 0.2s;
      font-weight: 500; font-family: inherit; color: var(--text-secondary);
      &:hover { border-color: var(--primary); color: var(--primary); }
    }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .policy-card { transition: transform 0.2s, box-shadow 0.2s; }
    .policy-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .policy-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .policy-icon { font-size: 2.25rem; }
    .policy-name { margin-bottom: 8px; }
    .policy-desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 18px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.6; }
    .policy-meta { display: flex; flex-direction: column; gap: 8px; }
    .meta-item { display: flex; justify-content: space-between; font-size: 13px; }
    .meta-label { color: var(--text-muted); }
    .meta-value { font-weight: 600; color: var(--text-primary); }
    .empty-state { text-align: center; padding: 48px 24px; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.4; }
    .loading-state { text-align: center; padding: 48px; }
    .spinner {
      width: 36px; height: 36px; border: 3px solid var(--border);
      border-top-color: var(--primary); border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PoliciesComponent implements OnInit {
  policies: Policy[] = [];
  loading = false;
  selectedType = '';
  policyTypes = [
    { label: 'All', value: '' },
    { label: 'Auto', value: 'AUTO' },
    { label: 'Home', value: 'HOME' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Life', value: 'LIFE' },
    { label: 'Travel', value: 'TRAVEL' }
  ];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

  constructor(private policyService: PolicyService) {}
  ngOnInit() { this.loadPolicies(); }

  loadPolicies() {
    this.loading = true;
    this.policyService.getActivePolicies(0, 20).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.policies = this.selectedType
            ? res.data.content.filter(p => p.policyType === this.selectedType)
            : res.data.content;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  filterByType(type: string) {
    this.selectedType = type;
    this.loadPolicies();
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = { AUTO: '🚗', HOME: '🏠', HEALTH: '🏥', LIFE: '❤️', TRAVEL: '✈️' };
    return icons[type] || '📋';
  }
}
