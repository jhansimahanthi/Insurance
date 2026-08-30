export interface Claim {
  id: number;
  claimNumber: string;
  customerId: number;
  policyId: number;
  claimType: string;
  description: string;
  claimAmount: number;
  incidentDate: string;
  status: string;
  adminNotes?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface SubmitClaimRequest {
  customerId: number;
  policyId: number;
  claimType: string;
  description: string;
  claimAmount: number;
  incidentDate: string;
}

export interface UpdateClaimStatusRequest {
  status: string;
  adminNotes?: string;
}
