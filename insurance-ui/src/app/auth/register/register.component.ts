import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card card">
          <div class="auth-header">
            <div class="logo">🛡️ InsurePro</div>
            <h2>Create Account</h2>
            <p>Join InsurePro today</p>
          </div>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" class="form-control" [(ngModel)]="request.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" class="form-control" [(ngModel)]="request.lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="request.email" name="email" required email>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" class="form-control" [(ngModel)]="request.phone" name="phone">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input [type]="showPassword ? 'text' : 'password'" class="form-control"
                     [(ngModel)]="request.password" name="password" required minlength="8">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input [type]="showPassword ? 'text' : 'password'" class="form-control"
                     [(ngModel)]="request.confirmPassword" name="confirmPassword" required>
            </div>
            <div *ngIf="error" class="alert alert-error">{{ error }}</div>
            <div *ngIf="success" class="alert alert-success">{{ success }}</div>
            <button type="submit" class="btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 20px; }
    .auth-container { width: 100%; max-width: 480px; }
    .auth-card { padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .logo { font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { position: relative; }
    .toggle-password { position: absolute; right: 12px; top: 36px; background: none; border: none; cursor: pointer; font-size: 16px; }
    .alert-error { background: #fee2e2; color: var(--danger); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 16px; font-size: 13px; }
    .alert-success { background: #dcfce7; color: var(--success); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 16px; font-size: 13px; }
    .btn-block { width: 100%; padding: 12px; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 13px; }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent {
  request: RegisterRequest = { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' };
  showPassword = false;
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.request.password !== this.request.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register(this.request).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.success = 'Account created! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.error = res.message || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
