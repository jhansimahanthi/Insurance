import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../core/services/policy.service';
import { PolicyPurchase } from '../../core/models/policy.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-purchases',
  standalone: true,
  imports: [CommonModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Purchase Management</h1>
        <span class="text-muted">{{ purchases.length }} purchases</span>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Purchase #</th>
                <th>Customer</th>
                <th>Policy</th>
                <th>Premium</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of purchases">
                <td><strong>{{ p.purchaseNumber }}</strong></td>
                <td>ID: {{ p.customerId }}</td>
                <td>{{ p.policyName }}</td>
                <td>\${{ p.premium }}/mo</td>
                <td>{{ p.startDate | date:'mediumDate' }}</td>
                <td>{{ p.endDate | date:'mediumDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(p.status)">{{ p.status }}</span>
                </td>
              </tr>
              <tr *ngIf="purchases.length === 0">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">🛒</div>
                  <p>No purchases found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: []
})
export class AdminPurchasesComponent implements OnInit {
  purchases: PolicyPurchase[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

  constructor(private policyService: PolicyService) {}
  ngOnInit() { this.policyService.getPurchases(0, 50).subscribe(res => { if (res.success && res.data) this.purchases = res.data.content; }); }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'PENDING_PAYMENT': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
