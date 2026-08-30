import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { PolicyPurchase } from '../../core/models/policy.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="payment-page">
      <div class="payment-container">
        <div *ngIf="!paymentSuccess" class="card payment-card">
          <div class="payment-header">
            <h2>💳 Payment</h2>
            <p class="text-muted">Complete your policy purchase</p>
          </div>
          <div *ngIf="purchase" class="order-summary">
            <div class="summary-row"><span>Policy</span><strong>{{ purchase.policyName }}</strong></div>
            <div class="summary-row"><span>Purchase #</span><span>{{ purchase.purchaseNumber }}</span></div>
            <div class="summary-row"><span>Start Date</span><span>{{ purchase.startDate | date:'mediumDate' }}</span></div>
            <div class="summary-row"><span>End Date</span><span>{{ purchase.endDate | date:'mediumDate' }}</span></div>
            <div class="summary-row total"><span>Amount Due</span><strong>\${{ purchase.premium }}</strong></div>
          </div>
          <form (ngSubmit)="processPayment()">
            <div class="form-group">
              <label>Payment Method</label>
              <select class="form-control" [(ngModel)]="payment.paymentMethod" name="method" required>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
              </select>
            </div>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" class="form-control" [(ngModel)]="payment.cardNumber" name="cardNumber"
                     placeholder="1234 5678 9012 3456" maxlength="16" required>
            </div>
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" class="form-control" [(ngModel)]="payment.cardHolderName" name="holder" placeholder="John Doe" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" class="form-control" [(ngModel)]="payment.expiryDate" name="expiry" placeholder="MM/YY" maxlength="5" required>
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="password" class="form-control" [(ngModel)]="payment.cvv" name="cvv" placeholder="123" maxlength="4" required>
              </div>
            </div>
            <div *ngIf="error" class="alert-error" style="margin-bottom: 16px;">{{ error }}</div>
            <button type="submit" class="btn-primary btn-block btn-lg" [disabled]="processing">
              {{ processing ? 'Processing Payment...' : 'Pay Now' }}
            </button>
            <p class="text-muted text-center" style="margin-top: 12px; font-size: 12px;">🔒 This is a simulated payment. No real charges will be made.</p>
          </form>
        </div>

        <div *ngIf="paymentSuccess" class="card success-card">
          <div class="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your policy has been activated.</p>
          <div *ngIf="paymentResult" class="success-details">
            <div class="summary-row"><span>Reference</span><strong>{{ paymentResult.paymentReference }}</strong></div>
            <div class="summary-row"><span>Amount</span><strong>\${{ paymentResult.amount }}</strong></div>
            <div class="summary-row"><span>Method</span><span>{{ paymentResult.paymentMethod }}</span></div>
          </div>
          <button class="btn-primary btn-lg" routerLink="/customer/purchases" style="margin-top: 24px;">View My Policies</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: var(--bg-primary); }
    .payment-container { width: 100%; max-width: 480px; }
    .payment-header { text-align: center; margin-bottom: 24px; }
    .payment-header h2 { margin-bottom: 4px; }
    .order-summary { margin-bottom: 24px; padding: 16px; background: var(--bg-primary); border-radius: var(--radius); }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid var(--border); }
    .summary-row:last-child { border-bottom: none; }
    .summary-row.total { font-size: 18px; border-top: 2px solid var(--border); margin-top: 8px; padding-top: 12px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .success-card { text-align: center; padding: 48px; }
    .success-icon { font-size: 4rem; margin-bottom: 16px; }
    .success-details { margin-top: 24px; text-align: left; }
    .alert-error { background: #fee2e2; color: var(--danger); padding: 10px 14px; border-radius: var(--radius); font-size: 13px; }
    .text-center { text-align: center; }
  `]
})
export class PaymentComponent implements OnInit {
  purchase: PolicyPurchase | null = null;
  payment = { paymentMethod: 'CREDIT_CARD', cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' };
  processing = false;
  error = '';
  paymentSuccess = false;
  paymentResult: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const purchaseId = +this.route.snapshot.paramMap.get('purchaseId')!;
    this.policyService.getPurchaseById(purchaseId).subscribe(res => {
      if (res.success && res.data) this.purchase = res.data;
    });
  }

  processPayment() {
    if (!this.purchase) return;
    this.processing = true;
    this.error = '';
    this.paymentService.processPayment({
      customerId: this.authService.userId(),
      policyId: this.purchase.policyId,
      purchaseId: this.purchase.id,
      amount: this.purchase.premium,
      paymentMethod: this.payment.paymentMethod,
      cardNumber: this.payment.cardNumber,
      cardHolderName: this.payment.cardHolderName,
      expiryDate: this.payment.expiryDate,
      cvv: this.payment.cvv
    }).subscribe({
      next: (res) => {
        this.processing = false;
        if (res.success && res.data) {
          this.paymentResult = res.data;
          this.paymentSuccess = true;
        } else {
          this.error = res.message || 'Payment failed';
        }
      },
      error: (err) => { this.processing = false; this.error = err.error?.message || 'Payment failed'; }
    });
  }
}
