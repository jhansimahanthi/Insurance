import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../core/services/claim.service';
import { Claim } from '../../core/models/claim.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header"><h1>Claim Management</h1></div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <button *ngFor="let s of statusFilters" class="filter-btn" [class.active]="selectedStatus === s.value"
                (click)="filterByStatus(s.value)">{{ s.label }}</button>
      </div>

      <!-- Claims Table -->
      <div class="card" style="margin-top: 20px;">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Claim #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of claims">
                <td><strong>{{ c.claimNumber }}</strong></td>
                <td>ID: {{ c.customerId }}</td>
                <td>{{ c.claimType }}</td>
                <td>\${{ c.claimAmount | number }}</td>
                <td>{{ c.incidentDate }}</td>
                <td><span class="badge" [ngClass]="getStatusClass(c.status)">{{ c.status }}</span></td>
                <td>
                  <select class="form-control action-select" *ngIf="c.status === 'SUBMITTED'"
                          (change)="updateStatus(c, $any($event.target).value)">
                    <option value="">Change Status</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                  <select class="form-control action-select" *ngIf="c.status === 'UNDER_REVIEW'"
                          (change)="updateStatus(c, $any($event.target).value)">
                    <option value="">Change Status</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                  <select class="form-control action-select" *ngIf="c.status === 'APPROVED'"
                          (change)="updateStatus(c, $any($event.target).value)">
                    <option value="">Change Status</option>
                    <option value="SETTLED">Settle</option>
                  </select>
                  <span *ngIf="c.status === 'REJECTED' || c.status === 'SETTLED'" class="text-muted" style="font-size: 12px;">No actions</span>
                </td>
              </tr>
              <tr *ngIf="claims.length === 0">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">📝</div>
                  <p>No claims found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn {
      padding: 8px 16px; border: 1px solid var(--border); border-radius: 9999px;
      background: white; font-size: 13px; cursor: pointer; transition: all 0.2s;
      font-weight: 500; font-family: inherit; color: var(--text-secondary);
      &:hover { border-color: var(--primary); color: var(--primary); }
    }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .action-select { width: auto; display: inline-block; font-size: 13px; padding: 6px 10px; }
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

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
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
