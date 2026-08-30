package com.insurance.claim.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.claim.dto.ClaimResponse;
import com.insurance.claim.dto.SubmitClaimRequest;
import com.insurance.claim.dto.UpdateClaimStatusRequest;

public interface ClaimService {
    ClaimResponse submitClaim(SubmitClaimRequest request);
    ClaimResponse getClaimById(Long id);
    ClaimResponse getClaimByNumber(String claimNumber);
    PaginatedResponse<ClaimResponse> getClaimsByCustomer(Long customerId, int page, int size);
    PaginatedResponse<ClaimResponse> getAllClaims(int page, int size, String status);
    ClaimResponse updateClaimStatus(Long id, UpdateClaimStatusRequest request);
}
