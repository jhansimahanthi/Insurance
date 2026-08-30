import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { QuoteService } from '../../core/services/quote.service';
import { Quote } from '../../core/models/quote.model';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/customer/quotes" class="nav-item active">💰 Quotes</a>
          <a routerLink="/customer/purchases" class="nav-item">🛒 My Policies</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header"><h1>My Quotes</h1></div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr><th>Quote #</th><th>Policy</th><th>Coverage</th><th>Premium</th><th>Risk</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let q of quotes">
                  <td><strong>{{ q.quoteNumber }}</strong></td>
                  <td>{{ q.policyName || 'N/A' }}</td>
                  <td>\${{ q.coverageAmount | number }}</td>
                  <td>\${{ q.calculatedPremium }}/mo</td>
                  <td><span class="badge" [ngClass]="q.riskLevel === 'HIGH' ? 'badge-danger' : q.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-success'">{{ q.riskLevel }}</span></td>
                  <td><span class="badge badge-info">{{ q.status }}</span></td>
                  <td><a [routerLink]="['/customer/quotes', q.id]" class="btn-primary btn-sm">View</a></td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="quotes.length === 0" class="empty-state" style="padding: 40px; text-align: center;">
              <p>No quotes yet. <a routerLink="/customer/policies">Browse policies</a> to generate a quote.</p>
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
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  constructor(private authService: AuthService, private quoteService: QuoteService) {}
  ngOnInit() {
    this.quoteService.getQuotesByCustomer(this.authService.userId()).subscribe(res => {
      if (res.success && res.data) this.quotes = res.data.content;
    });
  }
}
