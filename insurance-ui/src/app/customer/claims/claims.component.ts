import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ClaimService } from '../../core/services/claim.service';
import { PolicyService } from '../../core/services/policy.service';
import { Claim } from '../../core/models/claim.model';
import { PolicyPurchase } from '../../core/models/policy.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems">
      <div class="page-header">
        <h1>Insurance Claims</h1>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ Submit Claim' }}
        </button>
      </div>

      <!-- Submit Claim Form -->
      <div class="card" *ngIf="showForm" style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 20px;">Submit New Claim</h3>
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
              <label>Claim Amount ($)</label>
              <input type="number" class="form-control" [(ngModel)]="newClaim.claimAmount" name="claimAmount" min="1" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="3" [(ngModel)]="newClaim.description" name="description"
                      placeholder="Describe the incident in detail..."></textarea>
          </div>
          <div *ngIf="formError" class="alert alert-error" style="margin-bottom: 12px;">{{ formError }}</div>
          <button type="submit" class="btn-primary" [disabled]="submitting" style="margin-top: 4px;">
            {{ submitting ? 'Submitting...' : 'Submit Claim' }}
          </button>
        </form>
      </div>

      <!-- Claims Table -->
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
                <td>{{ claim.submittedAt | date:'mediumDate' }}</td>
              </tr>
              <tr *ngIf="claims.length === 0">
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">📝</div>
                  <p>No claims submitted yet</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea.form-control { resize: vertical; }
    .alert-error { background: var(--danger-bg); color: #991b1b; padding: 10px 14px; border-radius: var(--radius); font-size: 13px; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
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

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/customer/dashboard' },
    { icon: '📋', label: 'Policies', route: '/customer/policies' },
    { icon: '🛒', label: 'My Policies', route: '/customer/purchases' },
    { icon: '💰', label: 'Quotes', route: '/customer/quotes' },
    { icon: '📝', label: 'Claims', route: '/customer/claims' },
    { icon: '🔔', label: 'Notifications', route: '/customer/notifications' },
  ];

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
