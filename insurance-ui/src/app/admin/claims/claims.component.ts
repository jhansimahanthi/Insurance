import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../core/services/claim.service';
import { Claim } from '../../core/models/claim.model';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro <span class="badge badge-info">Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/admin/customers" class="nav-item">👥 Customers</a>
          <a routerLink="/admin/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/admin/claims" class="nav-item active">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header"><h1>Claim Management</h1></div>
        <div class="card">
          <div class="filter-bar" style="margin-bottom: 16px;">
            <button *ngFor="let s of statusFilters" class="filter-btn" [class.active]="selectedStatus === s.value" (click)="filterByStatus(s.value)">{{ s.label }}</button>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>Claim #</th><th>Customer</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of claims">
                  <td><strong>{{ c.claimNumber }}</strong></td>
                  <td>ID: {{ c.customerId }}</td>
                  <td>{{ c.claimType }}</td>
                  <td>\${{ c.claimAmount | number }}</td>
                  <td>{{ c.incidentDate }}</td>
                  <td><span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span></td>
                  <td>
                    <select class="form-control" *ngIf="c.status === 'SUBMITTED'" (change)="updateStatus(c, $any($event.target).value)" style="width: auto; display: inline-block;">
                      <option value="">Change Status</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                    </select>
                    <select class="form-control" *ngIf="c.status === 'UNDER_REVIEW'" (change)="updateStatus(c, $any($event.target).value)" style="width: auto; display: inline-block;">
                      <option value="">Change Status</option>
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                    <select class="form-control" *ngIf="c.status === 'APPROVED'" (change)="updateStatus(c, $any($event.target).value)" style="width: auto; display: inline-block;">
                      <option value="">Change Status</option>
                      <option value="SETTLED">Settle</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="claims.length === 0" class="empty-state" style="padding: 40px; text-align: center;">
              <p class="text-muted">No claims found.</p>
            </div>
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
    .filter-bar { display: flex; gap: 8px; }
    .filter-btn { padding: 8px 16px; border: 1px solid var(--border); border-radius: 9999px; background: white; font-size: 13px; cursor: pointer; }
    .filter-btn:hover { border-color: var(--primary); }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    @media (max-width: 768px) { .sidebar { display: none; } }
  `]
})
export class AdminClaimsComponent implements OnInit {
  claims: Claim[] = [];
  selectedStatus = '';
  statusFilters = [
    { label: 'All', value: '' }, { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' }, { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }, { label: 'Settled', value: 'SETTLED' }
  ];
  constructor(private claimService: ClaimService) {}
  ngOnInit() { this.load(); }
  load() { this.claimService.getAllClaims(0, 50, this.selectedStatus).subscribe(res => { if (res.success && res.data) this.claims = res.data.content; }); }
  filterByStatus(status: string) { this.selectedStatus = status; this.load(); }
  updateStatus(c: Claim, newStatus: string) {
    if (!newStatus) return;
    const notes = prompt('Admin notes (optional):') || '';
    this.claimService.updateClaimStatus(c.id, { status: newStatus, adminNotes: notes }).subscribe(() => this.load());
  }
  getStatusClass(status: string): string {
    switch (status) { case 'APPROVED': case 'SETTLED': return 'badge-success'; case 'REJECTED': return 'badge-danger'; case 'UNDER_REVIEW': return 'badge-warning'; default: return 'badge-info'; }
  }
}
