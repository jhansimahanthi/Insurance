package com.insurance.quote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteResponse {
    private Long id;
    private String quoteNumber;
    private Long customerId;
    private Long policyId;
    private String policyName;
    private Integer age;
    private BigDecimal coverageAmount;
    private Integer duration;
    private String riskLevel;
    private BigDecimal calculatedPremium;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
