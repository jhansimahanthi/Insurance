import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Protect What Matters Most</h1>
            <p>Comprehensive insurance solutions tailored to your needs. Get coverage you can count on.</p>
            <div class="hero-actions">
              <a routerLink="/register" class="btn-primary btn-lg">Get Started</a>
              <a routerLink="/customer/policies" class="btn-secondary btn-lg">Explore Policies</a>
            </div>
            <div class="hero-stats">
              <div class="stat"><strong>50K+</strong><span>Happy Customers</span></div>
              <div class="stat"><strong>99%</strong><span>Claims Settled</span></div>
              <div class="stat"><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="section categories">
        <div class="container">
          <h2 class="section-title">Insurance Categories</h2>
          <p class="section-subtitle">Choose from our wide range of insurance products</p>
          <div class="grid grid-3">
            <div class="category-card card" *ngFor="let cat of categories">
              <div class="cat-icon">{{ cat.icon }}</div>
              <h3>{{ cat.name }}</h3>
              <p>{{ cat.description }}</p>
              <a routerLink="/customer/policies" class="link-arrow">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="section features">
        <div class="container">
          <h2 class="section-title">Why Choose InsurePro</h2>
          <div class="grid grid-4">
            <div class="feature-item" *ngFor="let f of features">
              <div class="feature-icon">{{ f.icon }}</div>
              <h4>{{ f.title }}</h4>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section faq">
        <div class="container">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <div class="faq-list">
            <div class="faq-item card" *ngFor="let faq of faqs">
              <h4 (click)="faq.open = !faq.open" class="faq-question">
                {{ faq.q }} <span>{{ faq.open ? '−' : '+' }}</span>
              </h4>
              <p *ngIf="faq.open" class="faq-answer">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <app-footer />
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; padding: 80px 0; }
    .hero-content { max-width: 700px; }
    .hero h1 { font-size: 3rem; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
    .hero p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 32px; }
    .hero-actions { display: flex; gap: 16px; margin-bottom: 48px; }
    .hero-actions .btn-secondary { background: rgba(255,255,255,0.15); color: white; border-color: rgba(255,255,255,0.3); }
    .hero-stats { display: flex; gap: 48px; }
    .hero-stats .stat strong { display: block; font-size: 1.5rem; }
    .hero-stats .stat span { font-size: 0.85rem; opacity: 0.8; }
    .section { padding: 80px 0; }
    .section-title { text-align: center; font-size: 2rem; margin-bottom: 12px; }
    .section-subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 48px; }
    .category-card { text-align: center; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
    .category-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .cat-icon { font-size: 3rem; margin-bottom: 16px; }
    .link-arrow { color: var(--primary); font-weight: 500; }
    .features { background: var(--bg-primary); }
    .feature-item { text-align: center; padding: 24px; }
    .feature-icon { font-size: 2.5rem; margin-bottom: 12px; }
    .feature-item p { color: var(--text-secondary); font-size: 13px; }
    .faq-list { max-width: 700px; margin: 0 auto; }
    .faq-question { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 4px 0; }
    .faq-question span { font-size: 1.5rem; color: var(--primary); }
    .faq-answer { color: var(--text-secondary); margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--border); }
    .faq-item { margin-bottom: 12px; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .hero-stats { flex-direction: column; gap: 16px; }
    }
  `]
})
export class LandingComponent {
  categories = [
    { name: 'Auto Insurance', icon: '🚗', description: 'Protect your vehicle with comprehensive auto coverage' },
    { name: 'Home Insurance', icon: '🏠', description: 'Safeguard your home and belongings from unexpected events' },
    { name: 'Health Insurance', icon: '🏥', description: 'Quality healthcare coverage for you and your family' },
    { name: 'Life Insurance', icon: '❤️', description: 'Financial security for your loved ones' },
    { name: 'Travel Insurance', icon: '✈️', description: 'Stay protected wherever your journey takes you' },
    { name: 'Business Insurance', icon: '💼', description: 'Comprehensive coverage for your business needs' }
  ];

  features = [
    { icon: '⚡', title: 'Instant Quotes', desc: 'Get insurance quotes in seconds with our smart calculator' },
    { icon: '🔒', title: 'Secure & Trusted', desc: 'Your data is protected with enterprise-grade security' },
    { icon: '💳', title: 'Easy Payments', desc: 'Simple and secure online payment processing' },
    { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer support for all your needs' }
  ];

  faqs = [
    { q: 'How do I get an insurance quote?', a: 'Simply browse our policies, select the one that fits your needs, and click "Get Quote". Our system will calculate your premium based on the information you provide.', open: false },
    { q: 'How long does it take to process a claim?', a: 'Claims are typically reviewed within 3-5 business days. Once approved, settlement is processed within 7-10 business days.', open: false },
    { q: 'Can I manage my policies online?', a: 'Yes! Our customer portal allows you to view policies, make payments, submit claims, and track your claim status all in one place.', open: false },
    { q: 'What payment methods are accepted?', a: 'We accept credit cards, debit cards, UPI, and net banking for premium payments.', open: false }
  ];
}
