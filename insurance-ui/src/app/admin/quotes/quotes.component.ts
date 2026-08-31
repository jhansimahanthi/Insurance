import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../core/services/quote.service';
import { Quote } from '../../core/models/quote.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [CommonModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Quote Management</h1>
        <span class="text-muted">{{ quotes.length }} quotes</span>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Customer</th>
                <th>Policy</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let q of quotes">
                <td><strong>{{ q.quoteNumber }}</strong></td>
                <td>ID: {{ q.customerId }}</td>
                <td>{{ q.policyName || 'N/A' }}</td>
                <td>\${{ q.coverageAmount | number }}</td>
                <td>\${{ q.calculatedPremium }}/mo</td>
                <td>
                  <span class="badge" [ngClass]="getRiskClass(q.riskLevel)">{{ q.riskLevel }}</span>
                </td>
                <td><span class="badge badge-info">{{ q.status }}</span></td>
              </tr>
              <tr *ngIf="quotes.length === 0">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">💰</div>
                  <p>No quotes found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    :host ::ng-deep .badge-success { background: #dcfce7; color: #166534; }
    :host ::ng-deep .badge-warning { background: #fef3c7; color: #92400e; }
    :host ::ng-deep .badge-danger { background: #fee2e2; color: #991b1b; }
  `]
})
export class AdminQuotesComponent implements OnInit {
  quotes: Quote[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

  constructor(private quoteService: QuoteService) {}
  ngOnInit() { this.quoteService.getAllQuotes(0, 50).subscribe(res => { if (res.success && res.data) this.quotes = res.data.content; }); }

  getRiskClass(risk: string): string {
    switch (risk) {
      case 'HIGH': return 'badge-danger';
      case 'MEDIUM': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}
