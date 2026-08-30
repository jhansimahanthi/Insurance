import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card card">
          <div class="auth-header">
            <div class="logo">🛡️ InsurePro</div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" class="form-control" [(ngModel)]="request.email"
                     name="email" required email placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input [type]="showPassword ? 'text' : 'password'" id="password" class="form-control"
                     [(ngModel)]="request.password" name="password" required placeholder="Enter your password">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="form-actions">
              <label class="remember-me">
                <input type="checkbox" [(ngModel)]="rememberMe" name="remember"> Remember me
              </label>
            </div>
            <div *ngIf="error" class="alert alert-error">{{ error }}</div>
            <button type="submit" class="btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Create one</a></p>
          </div>
          <div class="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Admin: admin&#64;example.com / Demo&#64;12345</p>
            <p>Customer: customer1&#64;example.com / Demo&#64;12345</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 20px; }
    .auth-container { width: 100%; max-width: 420px; }
    .auth-card { padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }
    .auth-header h2 { margin-bottom: 8px; }
    .auth-header p { color: var(--text-secondary); }
    .form-group { position: relative; }
    .toggle-password { position: absolute; right: 12px; top: 36px; background: none; border: none; cursor: pointer; font-size: 16px; }
    .form-actions { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
    .remember-me { display: flex; align-items: center; gap: 6px; cursor: pointer; }
    .alert-error { background: #fee2e2; color: var(--danger); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 16px; font-size: 13px; }
    .btn-block { width: 100%; padding: 12px; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 13px; }
    .demo-credentials { margin-top: 20px; padding: 12px; background: var(--bg-primary); border-radius: var(--radius); font-size: 12px; }
    .demo-credentials p { margin: 2px 0; }
  `]
})
export class LoginComponent {
  request = { email: '', password: '' };
  showPassword = false;
  rememberMe = false;
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.request.email || !this.request.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.request).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.authService.setSession(res.data);
          if (res.data.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/customer/dashboard']);
          }
        } else {
          this.error = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
