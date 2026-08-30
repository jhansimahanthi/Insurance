import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./customer/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Customer routes
  {
    path: 'customer',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./customer/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'policies', loadComponent: () => import('./customer/policies/policies.component').then(m => m.PoliciesComponent) },
      { path: 'policies/:id', loadComponent: () => import('./customer/policy-details/policy-details.component').then(m => m.PolicyDetailsComponent) },
      { path: 'quotes', loadComponent: () => import('./customer/quotes/quotes.component').then(m => m.QuotesComponent) },
      { path: 'quotes/:id', loadComponent: () => import('./customer/quote-result/quote-result.component').then(m => m.QuoteResultComponent) },
      { path: 'purchases', loadComponent: () => import('./customer/purchases/purchases.component').then(m => m.PurchasesComponent) },
      { path: 'payment/:purchaseId', loadComponent: () => import('./customer/payment/payment.component').then(m => m.PaymentComponent) },
      { path: 'claims', loadComponent: () => import('./customer/claims/claims.component').then(m => m.ClaimsComponent) },
      { path: 'notifications', loadComponent: () => import('./customer/notifications/notifications.component').then(m => m.NotificationsComponent) },
    ]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'customers', loadComponent: () => import('./admin/customers/customers.component').then(m => m.AdminCustomersComponent) },
      { path: 'policies', loadComponent: () => import('./admin/policies/policies.component').then(m => m.AdminPoliciesComponent) },
      { path: 'quotes', loadComponent: () => import('./admin/quotes/quotes.component').then(m => m.AdminQuotesComponent) },
      { path: 'purchases', loadComponent: () => import('./admin/purchases/purchases.component').then(m => m.AdminPurchasesComponent) },
      { path: 'payments', loadComponent: () => import('./admin/payments/payments.component').then(m => m.AdminPaymentsComponent) },
      { path: 'claims', loadComponent: () => import('./admin/claims/claims.component').then(m => m.AdminClaimsComponent) },
    ]
  },

  { path: '**', redirectTo: '/landing' }
];
