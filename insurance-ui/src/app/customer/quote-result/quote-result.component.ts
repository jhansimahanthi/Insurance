import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuoteService } from '../../core/services/quote.service';
import { PolicyService } from '../../core/services/policy.service';
import { AuthService } from '../../core/services/auth.service';
import { Quote } from '../../core/models/quote.model';

@Component({
  selector: 'app-quote-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/quotes" class="nav-item active">💰 Quotes</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
        </nav>
      </aside>
      <main class="main-content">
        <a routerLink="/customer/quotes" class="back-link">← Back to Quotes</a>
        <div *ngIf="quote" class="card quote-detail">
          <div class="quote-header">
            <div>
              <h2>Quote {{ quote.quoteNumber }}</h2>
              <span class="badge badge-info">{{ quote.status }}</span>
            </div>
            <div class="quote-price">\${{ quote.calculatedPremium }}<span>/mo</span></div>
          </div>
          <div class="quote-grid">
            <div class="quote-item"><strong>Policy</strong><span>{{ quote.policyName }}</span></div>
            <div class="quote-item"><strong>Coverage</strong><span>\${{ quote.coverageAmount | number }}</span></div>
            <div class="quote-item"><strong>Duration</strong><span>{{ quote.duration }} months</span></div>
            <div class="quote-item"><strong>Risk Level</strong><span class="badge" [ngClass]="quote.riskLevel === 'HIGH' ? 'badge-danger' : quote.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-success'">{{ quote.riskLevel }}</span></div>
            <div class="quote-item"><strong>Age</strong><span>{{ quote.age }} years</span></div>
            <div class="quote-item"><strong>Valid Until</strong><span>{{ quote.expiresAt | date:'mediumDate' }}</span></div>
          </div>
          <div class="quote-actions">
            <button class="btn-primary btn-lg" (click)="purchasePolicy()" [disabled]="purchasing">
              {{ purchasing ? 'Processing...' : 'Proceed to Purchase' }}
            </button>
          </div>
          <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-error'" style="margin-top: 16px;">{{ message }}</div>
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
    .back-link { display: inline-block; margin-bottom: 20px; }
    .quote-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .quote-price { font-size: 2.5rem; font-weight: 700; color: var(--primary); }
    .quote-price span { font-size: 1rem; font-weight: 400; color: var(--text-secondary); }
    .quote-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .quote-item { padding: 16px; background: var(--bg-primary); border-radius: var(--radius); }
    .quote-item strong { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
    .quote-actions { text-align: center; }
    .alert-success { background: #dcfce7; color: var(--success); padding: 12px 16px; border-radius: var(--radius); }
    .alert-error { background: #fee2e2; color: var(--danger); padding: 12px 16px; border-radius: var(--radius); }
    @media (max-width: 768px) { .sidebar { display: none; } .quote-grid { grid-template-columns: 1fr; } }
  `]
})
export class QuoteResultComponent implements OnInit {
  quote: Quote | null = null;
  purchasing = false;
  message = '';
  messageType = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService,
    private policyService: PolicyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.quoteService.getQuoteById(id).subscribe(res => {
      if (res.success && res.data) this.quote = res.data;
    });
  }

  purchasePolicy() {
    if (!this.quote) return;
    this.purchasing = true;
    this.policyService.purchasePolicy({
      customerId: this.authService.userId(),
      policyId: this.quote.policyId,
      quoteId: this.quote.id,
      premium: this.quote.calculatedPremium
    }).subscribe({
      next: (res) => {
        this.purchasing = false;
        if (res.success && res.data) {
          this.message = 'Policy purchased! Redirecting to payment...';
          this.messageType = 'success';
          setTimeout(() => this.router.navigate(['/customer/payment', res.data!.id]), 2000);
        } else {
          this.message = res.message || 'Purchase failed';
          this.messageType = 'error';
        }
      },
      error: (err) => { this.purchasing = false; this.message = err.error?.message || 'Purchase failed'; this.messageType = 'error'; }
    });
  }
}
