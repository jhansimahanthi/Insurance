export interface Quote {
  id: number;
  quoteNumber: string;
  customerId: number;
  policyId: number;
  policyName?: string;
  age: number;
  coverageAmount: number;
  duration: number;
  riskLevel: string;
  calculatedPremium: number;
  status: string;
  createdAt?: string;
  expiresAt?: string;
}

export interface CreateQuoteRequest {
  customerId: number;
  policyId: number;
  age: number;
  coverageAmount: number;
  duration: number;
}
