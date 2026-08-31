import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../core/services/policy.service';
import { Policy, CreatePolicyRequest } from '../../core/models/policy.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Policy Management</h1>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ Create Policy' }}
        </button>
      </div>

      <!-- Create Policy Form -->
      <div class="card" *ngIf="showForm" style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 20px;">Create New Policy</h3>
        <form (ngSubmit)="createPolicy()">
          <div class="form-row-2">
            <div class="form-group">
              <label>Policy Name</label>
              <input class="form-control" [(ngModel)]="newPolicy.policyName" name="name"
                     placeholder="e.g. Comprehensive Auto Insurance" required>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select class="form-control" [(ngModel)]="newPolicy.policyType" name="type" required>
                <option value="AUTO">Auto</option><option value="HOME">Home</option>
                <option value="HEALTH">Health</option><option value="LIFE">Life</option>
                <option value="TRAVEL">Travel</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="2" [(ngModel)]="newPolicy.description" name="desc"
                      placeholder="Brief description of the policy..."></textarea>
          </div>
          <div class="form-row-3">
            <div class="form-group">
              <label>Coverage Amount ($)</label>
              <input type="number" class="form-control" [(ngModel)]="newPolicy.coverageAmount" name="coverage" required>
            </div>
            <div class="form-group">
              <label>Base Premium ($/mo)</label>
              <input type="number" class="form-control" [(ngModel)]="newPolicy.basePremium" name="premium" required>
            </div>
            <div class="form-group">
              <label>Duration (months)</label>
              <input type="number" class="form-control" [(ngModel)]="newPolicy.duration" name="duration" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 4px;">Create Policy</button>
        </form>
      </div>

      <!-- Policies Table -->
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Type</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of policies">
                <td><strong>{{ p.policyNumber }}</strong></td>
                <td>{{ p.policyName }}</td>
                <td><span class="badge badge-info">{{ p.policyType }}</span></td>
                <td>\${{ p.coverageAmount | number }}</td>
                <td>\${{ p.basePremium }}/mo</td>
                <td>{{ p.duration }} mo</td>
                <td><span class="badge" [ngClass]="p.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'">{{ p.status }}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn-secondary btn-sm" (click)="toggleStatus(p)">
                      {{ p.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button class="btn-danger btn-sm" (click)="deletePolicy(p)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="policies.length === 0">
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">📋</div>
                  <p>No policies found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .form-row-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    textarea.form-control { resize: vertical; }
    .action-btns { display: flex; gap: 6px; }
    @media (max-width: 768px) {
      .form-row-2, .form-row-3 { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminPoliciesComponent implements OnInit {
  policies: Policy[] = [];
  showForm = false;
  newPolicy: CreatePolicyRequest = { policyName: '', policyType: 'AUTO', description: '', coverageAmount: 50000, basePremium: 100, duration: 12 };

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

  constructor(private policyService: PolicyService) {}
  ngOnInit() { this.load(); }
  load() { this.policyService.getAllPolicies(0, 50).subscribe(res => { if (res.success && res.data) this.policies = res.data.content; }); }
  createPolicy() {
    this.policyService.createPolicy(this.newPolicy).subscribe(() => {
      this.load(); this.showForm = false;
      this.newPolicy = { policyName: '', policyType: 'AUTO', description: '', coverageAmount: 50000, basePremium: 100, duration: 12 };
    });
  }
  toggleStatus(p: Policy) { this.policyService.updatePolicy(p.id, { status: p.status === 'ACTIVE' ? 'DISCONTINUED' : 'ACTIVE' }).subscribe(() => this.load()); }
  deletePolicy(p: Policy) { if (confirm('Are you sure you want to discontinue this policy?')) this.policyService.deletePolicy(p.id).subscribe(() => this.load()); }
}
