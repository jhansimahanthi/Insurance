import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts"
           class="toast"
           [ngClass]="'toast-' + toast.type"
           (click)="remove(toast.id)">
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ' }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 80px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px; max-width: 400px;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: var(--radius);
      box-shadow: var(--shadow-lg); cursor: pointer;
      animation: slideIn 0.3s ease;
      font-size: 14px; font-weight: 500;
    }
    .toast-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
    .toast-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .toast-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .toast-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .toast-info { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @media (max-width: 768px) {
      .toast-container { right: 12px; left: 12px; max-width: none; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: { id: number; message: string; type: string }[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.remove(toast.id), 4000);
    });
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
