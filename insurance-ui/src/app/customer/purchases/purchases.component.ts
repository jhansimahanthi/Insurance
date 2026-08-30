import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { PolicyPurchase } from '../../core/models/policy.model';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/customer/purchases" class="nav-item active">🛒 My Policies</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
          <a routerLink="/customer/notifications" class="nav-item">🔔 Notifications</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header"><h1>My Policies</h1></div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr><th>Purchase #</th><th>Policy</th><th>Premium</th><th>Start Date</th><th>End Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of purchases">
                  <td><strong>{{ p.purchaseNumber }}</strong></td>
                  <td>{{ p.policyName }}</td>
                  <td>\${{ p.premium }}/mo</td>
                  <td>{{ p.startDate | date:'mediumDate' }}</td>
                  <td>{{ p.endDate | date:'mediumDate' }}</td>
                  <td><span class="badge" [ngClass]="p.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'">{{ p.status }}</span></td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="purchases.length === 0" class="empty-state" style="padding: 40px; text-align: center;">
              <p>No policies purchased yet. <a routerLink="/customer/policies">Browse policies</a> to get started.</p>
            </div>
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
    @media (max-width: 768px) { .sidebar { display: none; } }
  `]
})
export class PurchasesComponent implements OnInit {
  purchases: PolicyPurchase[] = [];
  constructor(private authService: AuthService, private policyService: PolicyService) {}
  ngOnInit() {
    this.policyService.getPurchasesByCustomer(this.authService.userId()).subscribe(res => {
      if (res.success && res.data) this.purchases = res.data.content;
    });
  }
}
