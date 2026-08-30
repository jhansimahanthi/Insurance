import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment.model';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro <span class="badge badge-info">Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/admin/customers" class="nav-item">👥 Customers</a>
          <a routerLink="/admin/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/admin/payments" class="nav-item active">💳 Payments</a>
          <a routerLink="/admin/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header"><h1>Payment Management</h1></div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>Reference</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                <tr *ngFor="let p of payments">
                  <td><strong>{{ p.paymentReference }}</strong></td>
                  <td>ID: {{ p.customerId }}</td>
                  <td>\${{ p.amount | number }}</td>
                  <td><span class="badge badge-secondary">{{ p.paymentMethod }}</span></td>
                  <td><span class="badge" [ngClass]="p.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">{{ p.status }}</span></td>
                  <td>{{ p.transactionDate | date:'medium' }}</td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="payments.length === 0" class="empty-state" style="padding: 40px; text-align: center;"><p class="text-muted">No payments found.</p></div>
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
export class AdminPaymentsComponent implements OnInit {
  payments: Payment[] = [];
  constructor(private paymentService: PaymentService) {}
  ngOnInit() { this.paymentService.getAllPayments(0, 50).subscribe(res => { if (res.success && res.data) this.payments = res.data.content; }); }
}
