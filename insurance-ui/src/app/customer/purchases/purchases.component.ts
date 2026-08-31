import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { PolicyPurchase } from '../../core/models/policy.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <h1>My Policies</h1>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Purchase #</th>
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
                <td>{{ p.policyName }}</td>
                <td>\${{ p.premium }}/mo</td>
                <td>{{ p.startDate | date:'mediumDate' }}</td>
                <td>{{ p.endDate | date:'mediumDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(p.status)">{{ p.status }}</span>
                </td>
              </tr>
              <tr *ngIf="purchases.length === 0">
                <td colspan="6" style="text-align: center; padding: 48px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">🛒</div>
                  <p>No policies purchased yet</p>
                  <a routerLink="/customer/policies" class="btn-primary btn-sm" style="margin-top: 12px;">Browse Policies</a>
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
export class PurchasesComponent implements OnInit {
  purchases: PolicyPurchase[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

  constructor(private authService: AuthService, private policyService: PolicyService) {}
  ngOnInit() {
    this.policyService.getPurchasesByCustomer(this.authService.userId()).subscribe(res => {
      if (res.success && res.data) this.purchases = res.data.content;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'PENDING_PAYMENT': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
