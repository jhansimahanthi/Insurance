import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { QuoteService } from '../../core/services/quote.service';
import { AuthService } from '../../core/services/auth.service';
import { Policy } from '../../core/models/policy.model';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro</div>
        <nav class="sidebar-nav">
          <a routerLink="/customer/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/customer/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/customer/purchases" class="nav-item">🛒 My Policies</a>
          <a routerLink="/customer/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <a routerLink="/customer/policies" class="back-link">← Back to Policies</a>
        <div *ngIf="policy" class="detail-layout">
          <div class="detail-main">
            <div class="card">
              <div class="policy-hero">
                <span class="policy-icon">{{ getIcon(policy.policyType) }}</span>
                <div>
                  <h1>{{ policy.policyName }}</h1>
                  <span class="badge badge-info">{{ policy.policyType }}</span>
                </div>
              </div>
              <p class="description">{{ policy.description }}</p>
              <div class="detail-grid">
                <div class="detail-item"><strong>Coverage Amount</strong><span>\${{ policy.coverageAmount | number }}</span></div>
                <div class="detail-item"><strong>Base Premium</strong><span>\${{ policy.basePremium }}/mo</span></div>
                <div class="detail-item"><strong>Duration</strong><span>{{ policy.duration }} months</span></div>
                <div class="detail-item"><strong>Status</strong><span class="badge badge-success">{{ policy.status }}</span></div>
              </div>
            </div>
            <div class="card" *ngIf="policy.benefits">
              <h3>Benefits</h3>
              <ul class="benefits-list">
                <li *ngFor="let b of policy.benefits.split(',')">{{ b.trim() }}</li>
              </ul>
            </div>
            <div class="card" *ngIf="policy.exclusions">
              <h3>Exclusions</h3>
              <ul class="exclusions-list">
                <li *ngFor="let e of policy.exclusions.split(',')">{{ e.trim() }}</li>
              </ul>
            </div>
          </div>
          <div class="detail-sidebar">
            <div class="card quote-card">
              <h3>Get a Quote</h3>
              <p class="text-muted" style="margin-bottom: 16px;">Tell us about yourself to get a personalized premium</p>
              <div class="form-group">
                <label>Your Age</label>
                <input type="number" class="form-control" [(ngModel)]="quoteRequest.age" min="18" max="100" placeholder="Enter your age">
              </div>
              <div class="form-group">
                <label>Coverage Amount</label>
                <input type="number" class="form-control" [(ngModel)]="quoteRequest.coverageAmount"
                       [min]="policy.coverageAmount * 0.1" [max]="policy.coverageAmount" [step]="1000"
                       [placeholder]="'Min: \$' + (policy.coverageAmount * 0.1 | number:'1.0-0')">
              </div>
              <div class="form-group">
                <label>Duration (months)</label>
                <input type="number" class="form-control" [(ngModel)]="quoteRequest.duration" min="1" [max]="policy.duration" placeholder="Duration in months">
              </div>
              <button class="btn-primary btn-block" (click)="generateQuote()" [disabled]="loading">
                {{ loading ? 'Calculating...' : 'Calculate Premium' }}
              </button>
              <div *ngIf="error" class="text-error" style="margin-top: 12px;">{{ error }}</div>
              <div *ngIf="quoteResult" class="quote-result">
                <div class="quote-premium">\${{ quoteResult.calculatedPremium }}<span>/mo</span></div>
                <div class="quote-details">
                  <div>Risk Level: <strong>{{ quoteResult.riskLevel }}</strong></div>
                  <div>Coverage: \${{ quoteResult.coverageAmount | number }}</div>
                  <div>Duration: {{ quoteResult.duration }} months</div>
                </div>
                <button class="btn-success btn-block" (click)="proceedToPurchase()" style="margin-top: 12px;">Proceed to Purchase</button>
              </div>
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
    .back-link { display: inline-block; margin-bottom: 20px; font-size: 14px; }
    .detail-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
    .policy-hero { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .policy-icon { font-size: 3rem; }
    .description { color: var(--text-secondary); margin-bottom: 24px; line-height: 1.7; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item { padding: 12px; background: var(--bg-primary); border-radius: var(--radius); }
    .detail-item strong { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
    .benefits-list, .exclusions-list { list-style: none; padding: 0; }
    .benefits-list li { padding: 8px 0; border-bottom: 1px solid var(--border); color: var(--text-secondary); }
    .benefits-list li::before { content: '✓ '; color: var(--success); font-weight: 700; }
    .exclusions-list li { padding: 8px 0; border-bottom: 1px solid var(--border); color: var(--text-secondary); }
    .exclusions-list li::before { content: '✕ '; color: var(--danger); font-weight: 700; }
    .quote-card { position: sticky; top: 88px; }
    .quote-result { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
    .quote-premium { font-size: 2rem; font-weight: 700; color: var(--primary); text-align: center; }
    .quote-premium span { font-size: 1rem; font-weight: 400; color: var(--text-secondary); }
    .quote-details { margin-top: 12px; font-size: 13px; color: var(--text-secondary); }
    .quote-details div { margin-bottom: 4px; }
    @media (max-width: 768px) { .sidebar { display: none; } .detail-layout { grid-template-columns: 1fr; } }
  `]
})
export class PolicyDetailsComponent implements OnInit {
  policy: Policy | null = null;
  quoteRequest = { age: 30, coverageAmount: 50000, duration: 12 };
  quoteResult: any = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private quoteService: QuoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.policyService.getPolicyById(id).subscribe(res => {
      if (res.success && res.data) {
        this.policy = res.data;
        this.quoteRequest.coverageAmount = res.data.coverageAmount * 0.5;
        this.quoteRequest.duration = res.data.duration;
      }
    });
  }

  generateQuote() {
    if (!this.policy) return;
    this.loading = true;
    this.error = '';
    this.quoteService.generateQuote({
      customerId: this.authService.userId(),
      policyId: this.policy.id,
      age: this.quoteRequest.age,
      coverageAmount: this.quoteRequest.coverageAmount,
      duration: this.quoteRequest.duration
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.quoteResult = res.data;
        } else {
          this.error = res.message || 'Failed to generate quote';
        }
      },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Failed to generate quote'; }
    });
  }

  proceedToPurchase() {
    if (this.quoteResult) {
      this.router.navigate(['/customer/quotes', this.quoteResult.id]);
    }
  }

  getIcon(type: string): string {
    return ({ AUTO: '🚗', HOME: '🏠', HEALTH: '🏥', LIFE: '❤️', TRAVEL: '✈️' } as Record<string, string>)[type] || '📋';
  }
}
