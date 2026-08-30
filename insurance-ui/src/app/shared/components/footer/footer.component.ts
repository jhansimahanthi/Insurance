import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>🛡️ InsurePro</h3>
            <p>Comprehensive insurance solutions for modern life. Protecting what matters most to you.</p>
          </div>
          <div>
            <h4>Products</h4>
            <a routerLink="/customer/policies">Auto Insurance</a>
            <a routerLink="/customer/policies">Home Insurance</a>
            <a routerLink="/customer/policies">Health Insurance</a>
            <a routerLink="/customer/policies">Life Insurance</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Claims</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 InsurePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: #0f172a; color: #94a3b8; padding: 60px 0 24px; margin-top: auto; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-brand h3 { color: white; margin-bottom: 12px; }
    .footer-brand p { font-size: 13px; line-height: 1.7; }
    .footer h4 { color: white; margin-bottom: 16px; font-size: 14px; }
    .footer a { display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px; }
    .footer a:hover { color: white; }
    .footer-bottom { border-top: 1px solid #1e293b; padding-top: 24px; text-align: center; font-size: 13px; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class FooterComponent {}
