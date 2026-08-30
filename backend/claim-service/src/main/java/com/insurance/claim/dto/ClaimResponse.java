package com.insurance.claim.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {
    private Long id;
    private String claimNumber;
    private Long customerId;
    private Long policyId;
    private String claimType;
    private String description;
    private BigDecimal claimAmount;
    private LocalDate incidentDate;
    private String status;
    private String adminNotes;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
