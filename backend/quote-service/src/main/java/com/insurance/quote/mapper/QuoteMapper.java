package com.insurance.quote.mapper;

import com.insurance.quote.dto.QuoteResponse;
import com.insurance.quote.entity.Quote;
import org.springframework.stereotype.Component;

@Component
public class QuoteMapper {

    public QuoteResponse toResponse(Quote quote, String policyName) {
        return QuoteResponse.builder()
                .id(quote.getId())
                .quoteNumber(quote.getQuoteNumber())
                .customerId(quote.getCustomerId())
                .policyId(quote.getPolicyId())
                .policyName(policyName)
                .age(quote.getAge())
                .coverageAmount(quote.getCoverageAmount())
                .duration(quote.getDuration())
                .riskLevel(quote.getRiskLevel())
                .calculatedPremium(quote.getCalculatedPremium())
                .status(quote.getStatus().name())
                .createdAt(quote.getCreatedAt())
                .expiresAt(quote.getExpiresAt())
                .build();
    }
}
