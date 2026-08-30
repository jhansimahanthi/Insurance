package com.insurance.claim.mapper;

import com.insurance.claim.dto.ClaimResponse;
import com.insurance.claim.entity.Claim;
import org.springframework.stereotype.Component;

@Component
public class ClaimMapper {

    public ClaimResponse toResponse(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .claimNumber(claim.getClaimNumber())
                .customerId(claim.getCustomerId())
                .policyId(claim.getPolicyId())
                .claimType(claim.getClaimType())
                .description(claim.getDescription())
                .claimAmount(claim.getClaimAmount())
                .incidentDate(claim.getIncidentDate())
                .status(claim.getStatus().name())
                .adminNotes(claim.getAdminNotes())
                .submittedAt(claim.getSubmittedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }
}
