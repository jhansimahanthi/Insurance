export interface Policy {
  id: number;
  policyNumber: string;
  policyName: string;
  policyType: string;
  description: string;
  coverageAmount: number;
  basePremium: number;
  duration: number;
  status: string;
  benefits?: string;
  exclusions?: string;
  createdAt?: string;
}

export interface PolicyPurchase {
  id: number;
  purchaseNumber: string;
  customerId: number;
  policyId: number;
  policyName: string;
  quoteId?: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt?: string;
}

export interface CreatePolicyRequest {
  policyName: string;
  policyType: string;
  description: string;
  coverageAmount: number;
  basePremium: number;
  duration: number;
  benefits?: string;
  exclusions?: string;
}

export interface PurchasePolicyRequest {
  customerId: number;
  policyId: number;
  quoteId?: number;
  premium: number;
}
