import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Payment Management</h1>
        <span class="text-muted">{{ payments.length }} payments</span>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Policy</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td><strong>{{ p.paymentReference }}</strong></td>
                <td>ID: {{ p.customerId }}</td>
                <td>ID: {{ p.policyId }}</td>
                <td class="amount">\${{ p.amount | number }}</td>
                <td><span class="badge badge-secondary">{{ p.paymentMethod }}</span></td>
                <td><span class="badge" [ngClass]="p.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">{{ p.status }}</span></td>
                <td>{{ p.transactionDate | date:'mediumDate' }}</td>
              </tr>
              <tr *ngIf="payments.length === 0">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">💳</div>
                  <p>No payments found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .amount { font-weight: 600; color: var(--success); }
  `]
})
export class AdminPaymentsComponent implements OnInit {
  payments: Payment[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

  constructor(private paymentService: PaymentService) {}
  ngOnInit() { this.paymentService.getAllPayments(0, 50).subscribe(res => { if (res.success && res.data) this.payments = res.data.content; }); }
}
