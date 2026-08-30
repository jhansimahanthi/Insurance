package com.insurance.claim.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitClaimRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotBlank(message = "Claim type is required")
    private String claimType;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    @NotNull(message = "Claim amount is required")
    @DecimalMin(value = "1.00", message = "Claim amount must be at least 1.00")
    private BigDecimal claimAmount;

    @NotNull(message = "Incident date is required")
    @PastOrPresent(message = "Incident date cannot be in the future")
    private LocalDate incidentDate;
}
