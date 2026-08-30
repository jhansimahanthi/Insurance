import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClaimService } from '../../core/services/claim.service';
import { PolicyService } from '../../core/services/policy.service';
import { Claim } from '../../core/models/claim.model';
import { PolicyPurchase } from '../../core/models/policy.model';

@Component({
  selector: 'app-claims',
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
          <a routerLink="/customer/claims" class="nav-item active">📝 Claims</a>
          <a routerLink="/customer/notifications" class="nav-item">🔔 Notifications</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>Insurance Claims</h1>
          <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Cancel' : '+ Submit Claim' }}</button>
        </div>

        <!-- Submit Claim Form -->
        <div class="card" *ngIf="showForm" style="margin-bottom: 24px;">
          <h3>Submit New Claim</h3>
          <form (ngSubmit)="submitClaim()">
            <div class="form-row">
              <div class="form-group">
                <label>Policy</label>
                <select class="form-control" [(ngModel)]="newClaim.policyId" name="policyId" required>
                  <option value="">Select a policy</option>
                  <option *ngFor="let p of purchases" [value]="p.policyId">{{ p.policyName }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Claim Type</label>
                <select class="form-control" [(ngModel)]="newClaim.claimType" name="claimType" required>
                  <option value="">Select type</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="THEFT">Theft</option>
                  <option value="NATURAL_DISASTER">Natural Disaster</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="PROPERTY_DAMAGE">Property Damage</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Incident Date</label>
                <input type="date" class="form-control" [(ngModel)]="newClaim.incidentDate" name="incidentDate" required>
              </div>
              <div class="form-group">
                <label>Claim Amount (\$)</label>
                <input type="number" class="form-control" [(ngModel)]="newClaim.claimAmount" name="claimAmount" min="1" required>
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="newClaim.description" name="description" placeholder="Describe the incident..."></textarea>
            </div>
            <div *ngIf="formError" class="text-error">{{ formError }}</div>
            <div *ngIf="formSuccess" class="badge badge-success" style="padding: 10px 16px;">{{ formSuccess }}</div>
            <button type="submit" class="btn-primary" [disabled]="submitting" style="margin-top: 12px;">
              {{ submitting ? 'Submitting...' : 'Submit Claim' }}
            </button>
          </form>
        </div>

        <!-- Claims List -->
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Claim #</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Incident Date</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let claim of claims">
                  <td><strong>{{ claim.claimNumber }}</strong></td>
                  <td>{{ claim.claimType }}</td>
                  <td>\${{ claim.claimAmount | number }}</td>
                  <td>{{ claim.incidentDate }}</td>
                  <td><span class="badge" [ngClass]="getStatusClass(claim.status)">{{ claim.status }}</span></td>
                  <td>{{ claim.submittedAt | date:'medium' }}</td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="claims.length === 0" class="empty-state" style="padding: 40px; text-align: center;">
              <p>No claims submitted yet.</p>
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
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea.form-control { resize: vertical; }
    @media (max-width: 768px) { .sidebar { display: none; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  purchases: PolicyPurchase[] = [];
  showForm = false;
  submitting = false;
  formError = '';
  formSuccess = '';
  newClaim = { policyId: '', claimType: '', incidentDate: '', claimAmount: 0, description: '' };

  constructor(
    private authService: AuthService,
    private claimService: ClaimService,
    private policyService: PolicyService
  ) {}

  ngOnInit() {
    const userId = this.authService.userId();
    if (userId) {
      this.claimService.getClaimsByCustomer(userId).subscribe(res => {
        if (res.success && res.data) this.claims = res.data.content;
      });
      this.policyService.getPurchasesByCustomer(userId).subscribe(res => {
        if (res.success && res.data) this.purchases = res.data.content;
      });
    }
  }

  submitClaim() {
    this.submitting = true;
    this.formError = '';
    this.claimService.submitClaim({
      customerId: this.authService.userId(),
      policyId: +this.newClaim.policyId,
      claimType: this.newClaim.claimType,
      incidentDate: this.newClaim.incidentDate,
      claimAmount: this.newClaim.claimAmount,
      description: this.newClaim.description
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success) {
          this.formSuccess = 'Claim submitted successfully!';
          this.claims.unshift(res.data!);
          this.showForm = false;
          this.newClaim = { policyId: '', claimType: '', incidentDate: '', claimAmount: 0, description: '' };
        } else {
          this.formError = res.message;
        }
      },
      error: (err) => { this.submitting = false; this.formError = err.error?.message || 'Failed to submit claim'; }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': case 'SETTLED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      case 'UNDER_REVIEW': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}
