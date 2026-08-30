package com.insurance.policy.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePolicyRequest {

    @NotBlank(message = "Policy name is required")
    @Size(min = 3, max = 100, message = "Policy name must be 3-100 characters")
    private String policyName;

    @NotBlank(message = "Policy type is required")
    private String policyType;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(value = "1000", message = "Coverage amount must be at least 1000")
    private BigDecimal coverageAmount;

    @NotNull(message = "Base premium is required")
    @DecimalMin(value = "100", message = "Base premium must be at least 100")
    private BigDecimal basePremium;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 month")
    @Max(value = 360, message = "Duration cannot exceed 360 months")
    private Integer duration;

    private String benefits;
    private String exclusions;
}
