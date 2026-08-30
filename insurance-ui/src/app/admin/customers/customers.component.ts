import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">🛡️ InsurePro <span class="badge badge-info">Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item">📊 Dashboard</a>
          <a routerLink="/admin/customers" class="nav-item active">👥 Customers</a>
          <a routerLink="/admin/policies" class="nav-item">📋 Policies</a>
          <a routerLink="/admin/claims" class="nav-item">📝 Claims</a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="page-header"><h1>Customer Management</h1></div>
        <div class="card">
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <input type="text" class="form-control" [(ngModel)]="search" placeholder="Search customers..."
                   (keyup.enter)="loadCustomers()" style="max-width: 300px;">
            <button class="btn-primary" (click)="loadCustomers()">Search</button>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of customers">
                  <td>{{ c.id }}</td>
                  <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                  <td>{{ c.email }}</td>
                  <td>{{ c.phone || 'N/A' }}</td>
                  <td><span class="badge" [ngClass]="c.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'">{{ c.status }}</span></td>
                  <td>
                    <button class="btn-secondary btn-sm" (click)="toggleStatus(c)">
                      {{ c.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
            <span class="text-muted">Showing {{ customers.length }} of {{ totalElements }} customers</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary btn-sm" [disabled]="page === 0" (click)="prevPage()">Previous</button>
              <button class="btn-secondary btn-sm" [disabled]="customers.length < 10" (click)="nextPage()">Next</button>
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
    @media (max-width: 768px) { .sidebar { display: none; } }
  `]
})
export class AdminCustomersComponent implements OnInit {
  customers: User[] = [];
  search = '';
  page = 0;
  totalElements = 0;
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
