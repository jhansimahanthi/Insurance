import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { Policy, CreatePolicyRequest } from '../../core/models/policy.model';

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro <span class="badge badge-info">Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/admin/customers" class="nav-item">👥 Customers</a>
          <a routerLink="/admin/policies" class="nav-item active">📋 Policies</a>
          <a routerLink="/admin/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>Policy Management</h1>
          <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Cancel' : '+ Create Policy' }}</button>
        </div>
        <div class="card" *ngIf="showForm" style="margin-bottom: 24px;">
          <h3>Create New Policy</h3>
          <form (ngSubmit)="createPolicy()">
            <div class="form-row">
              <div class="form-group"><label>Policy Name</label><input class="form-control" [(ngModel)]="newPolicy.policyName" name="name" required></div>
              <div class="form-group"><label>Type</label>
                <select class="form-control" [(ngModel)]="newPolicy.policyType" name="type" required>
                  <option value="AUTO">Auto</option><option value="HOME">Home</option><option value="HEALTH">Health</option>
                  <option value="LIFE">Life</option><option value="TRAVEL">Travel</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label>Description</label><textarea class="form-control" rows="2" [(ngModel)]="newPolicy.description" name="desc"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Coverage Amount</label><input type="number" class="form-control" [(ngModel)]="newPolicy.coverageAmount" name="coverage" required></div>
              <div class="form-group"><label>Base Premium ($/mo)</label><input type="number" class="form-control" [(ngModel)]="newPolicy.basePremium" name="premium" required></div>
              <div class="form-group"><label>Duration (months)</label><input type="number" class="form-control" [(ngModel)]="newPolicy.duration" name="duration" required></div>
            </div>
            <button type="submit" class="btn-primary">Create Policy</button>
          </form>
        </div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>Number</th><th>Name</th><th>Type</th><th>Coverage</th><th>Premium</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr *ngFor="let p of policies">
                  <td><strong>{{ p.policyNumber }}</strong></td>
                  <td>{{ p.policyName }}</td>
                  <td><span class="badge badge-info">{{ p.policyType }}</span></td>
                  <td>\${{ p.coverageAmount | number }}</td>
                  <td>\${{ p.basePremium }}/mo</td>
                  <td><span class="badge" [ngClass]="p.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'">{{ p.status }}</span></td>
                  <td>
                    <button class="btn-secondary btn-sm" (click)="toggleStatus(p)">{{ p.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}</button>
                    <button class="btn-danger btn-sm" style="margin-left: 4px;" (click)="deletePolicy(p)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
    .form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .sidebar { display: none; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class AdminPoliciesComponent implements OnInit {
  policies: Policy[] = [];
  showForm = false;
  newPolicy: CreatePolicyRequest = { policyName: '', policyType: 'AUTO', description: '', coverageAmount: 50000, basePremium: 100, duration: 12 };
  constructor(private policyService: PolicyService) {}
  ngOnInit() { this.load(); }
  load() { this.policyService.getAllPolicies(0, 50).subscribe(res => { if (res.success && res.data) this.policies = res.data.content; }); }
  createPolicy() {
    this.policyService.createPolicy(this.newPolicy).subscribe(() => { this.load(); this.showForm = false; this.newPolicy = { policyName: '', policyType: 'AUTO', description: '', coverageAmount: 50000, basePremium: 100, duration: 12 }; });
  }
  toggleStatus(p: Policy) { this.policyService.updatePolicy(p.id, { status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }).subscribe(() => this.load()); }
  deletePolicy(p: Policy) { if (confirm('Are you sure?')) this.policyService.deletePolicy(p.id).subscribe(() => this.load()); }
}
