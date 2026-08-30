export interface Payment {
  id: number;
  paymentReference: string;
  customerId: number;
  policyId: number;
  purchaseId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionDate?: string;
  createdAt?: string;
}

export interface PaymentRequest {
  customerId: number;
  policyId: number;
  purchaseId: number;
  amount: number;
  paymentMethod: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}
