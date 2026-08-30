import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { Policy } from '../../core/models/policy.model';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item active">📋 Policies</a>
          <a routerLink="/customer/purchases" class="nav-item">🛒 My Policies</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
          <a routerLink="/customer/notifications" class="nav-item">🔔 Notifications</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>Insurance Policies</h1>
        </div>
        <div class="filter-bar">
          <button *ngFor="let t of policyTypes" class="filter-btn" [class.active]="selectedType === t.value"
                  (click)="filterByType(t.value)">{{ t.label }}</button>
        </div>
        <div class="grid grid-3" style="margin-top: 24px;">
          <div class="policy-card card" *ngFor="let policy of policies">
            <div class="policy-header">
              <span class="policy-icon">{{ getIcon(policy.policyType) }}</span>
              <span class="badge badge-info">{{ policy.policyType }}</span>
            </div>
            <h3>{{ policy.policyName }}</h3>
            <p class="policy-desc">{{ policy.description }}</p>
            <div class="policy-meta">
              <div><strong>Coverage:</strong> \${{ policy.coverageAmount | number }}</div>
              <div><strong>Starting at:</strong> \${{ policy.basePremium }}/mo</div>
              <div><strong>Duration:</strong> {{ policy.duration }} months</div>
            </div>
            <a [routerLink]="['/customer/policies', policy.id]" class="btn-primary btn-block" style="margin-top: 16px;">View Details</a>
          </div>
        </div>
        <div *ngIf="policies.length === 0 && !loading" class="empty-state card" style="text-align: center; padding: 48px;">
          <p>No policies available at the moment.</p>
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
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn { padding: 8px 16px; border: 1px solid var(--border); border-radius: 9999px; background: white; font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .filter-btn:hover { border-color: var(--primary); }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .policy-card { transition: transform 0.2s; }
    .policy-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .policy-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .policy-icon { font-size: 2rem; }
    .policy-desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .policy-meta { font-size: 13px; }
    .policy-meta div { margin-bottom: 6px; }
    @media (max-width: 768px) { .sidebar { display: none; } }
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
