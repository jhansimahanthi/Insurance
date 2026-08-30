package com.insurance.policy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePolicyRequest {
    private String policyName;
    private String policyType;
    private String description;
    private BigDecimal coverageAmount;
    private BigDecimal basePremium;
    private Integer duration;
    private String status;
    private String benefits;
    private String exclusions;
}
