import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/user.model';
import { SidebarLayoutComponent, SidebarItem } from '../../shared/components/sidebar-layout/sidebar-layout.component';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout [items]="sidebarItems" [isAdmin]="true">
      <div class="page-header">
        <h1>Customer Management</h1>
        <span class="text-muted">{{ totalElements }} total customers</span>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" class="form-control" [(ngModel)]="search" placeholder="🔍  Search by name or email..."
               (keyup.enter)="loadCustomers()" style="max-width: 360px;">
        <button class="btn-primary btn-sm" (click)="loadCustomers()">Search</button>
        <button *ngIf="search" class="btn-secondary btn-sm" (click)="search = ''; loadCustomers()">Clear</button>
      </div>

      <!-- Customers Table -->
      <div class="card" style="margin-top: 20px;">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of customers">
                <td>{{ c.id }}</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ c.firstName?.charAt(0) }}{{ c.lastName?.charAt(0) }}</div>
                    <strong>{{ c.firstName }} {{ c.lastName }}</strong>
                  </div>
                </td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone || '—' }}</td>
                <td><span class="badge" [ngClass]="c.role === 'ADMIN' ? 'badge-info' : 'badge-secondary'">{{ c.role }}</span></td>
                <td><span class="badge" [ngClass]="c.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'">{{ c.status }}</span></td>
                <td>
                  <button class="btn-secondary btn-sm" (click)="toggleStatus(c)">
                    {{ c.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="customers.length === 0">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;">👥</div>
                  <p>No customers found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalElements > 10">
          <span class="text-muted">Showing {{ page * 10 + 1 }}–{{ Math.min((page + 1) * 10, totalElements) }} of {{ totalElements }}</span>
          <div class="pagination-btns">
            <button class="btn-secondary btn-sm" [disabled]="page === 0" (click)="prevPage()">← Previous</button>
            <span class="page-info">Page {{ page + 1 }}</span>
            <button class="btn-secondary btn-sm" [disabled]="(page + 1) * 10 >= totalElements" (click)="nextPage()">Next →</button>
          </div>
        </div>
      </div>
    </app-sidebar-layout>
  `,
  styles: [`
    .search-bar { display: flex; align-items: center; gap: 10px; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%; background: var(--primary-50);
      color: var(--primary); display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; flex-shrink: 0; border: 1px solid #bfdbfe;
    }
    .pagination {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 0 0; border-top: 1px solid var(--border-light); margin-top: 8px;
    }
    .pagination-btns { display: flex; align-items: center; gap: 12px; }
    .page-info { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
  `]
})
export class AdminCustomersComponent implements OnInit {
  customers: User[] = [];
  search = '';
  page = 0;
  totalElements = 0;
  Math = Math;

  sidebarItems: SidebarItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '👥', label: 'Customers', route: '/admin/customers' },
    { icon: '📋', label: 'Policies', route: '/admin/policies' },
    { icon: '💰', label: 'Quotes', route: '/admin/quotes' },
    { icon: '🛒', label: 'Purchases', route: '/admin/purchases' },
    { icon: '💳', label: 'Payments', route: '/admin/payments' },
    { icon: '📝', label: 'Claims', route: '/admin/claims' },
  ];

  constructor(private adminService: AdminService) {}
  ngOnInit() { this.loadCustomers(); }
  loadCustomers() {
    this.adminService.getCustomers(this.page, 10, this.search).subscribe(res => {
      if (res.success && res.data) {
        this.customers = res.data.content;
        this.totalElements = res.data.totalElements;
      }
    });
  }
  prevPage() { if (this.page > 0) { this.page--; this.loadCustomers(); } }
  nextPage() { this.page++; this.loadCustomers(); }
  toggleStatus(c: User) {
    const newStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.adminService.updateCustomerStatus(c.id, newStatus).subscribe(() => this.loadCustomers());
  }
}
