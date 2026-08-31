import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { QuoteService } from '../../core/services/quote.service';
import { Quote } from '../../core/models/quote.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <h1>My Quotes</h1>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Policy</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let q of quotes">
                <td><strong>{{ q.quoteNumber }}</strong></td>
                <td>{{ q.policyName || 'N/A' }}</td>
                <td>\${{ q.coverageAmount | number }}</td>
                <td>\${{ q.calculatedPremium }}/mo</td>
                <td>
                  <span class="badge" [ngClass]="getRiskClass(q.riskLevel)">{{ q.riskLevel }}</span>
                </td>
                <td><span class="badge badge-info">{{ q.status }}</span></td>
                <td><a [routerLink]="['/customer/quotes', q.id]" class="btn-primary btn-sm">View</a></td>
              </tr>
              <tr *ngIf="quotes.length === 0">
                <td colspan="7" style="text-align: center; padding: 48px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">💰</div>
                  <p>No quotes yet</p>
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
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

  constructor(private authService: AuthService, private quoteService: QuoteService) {}
  ngOnInit() {
    this.quoteService.getQuotesByCustomer(this.authService.userId()).subscribe(res => {
      if (res.success && res.data) this.quotes = res.data.content;
    });
  }

  getRiskClass(risk: string): string {
    switch (risk) {
      case 'HIGH': return 'badge-danger';
      case 'MEDIUM': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}
