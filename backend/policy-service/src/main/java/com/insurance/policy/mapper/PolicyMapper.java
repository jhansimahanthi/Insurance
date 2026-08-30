package com.insurance.policy.mapper;

import com.insurance.policy.dto.PolicyResponse;
import com.insurance.policy.dto.PurchaseResponse;
import com.insurance.policy.entity.InsurancePolicy;
import com.insurance.policy.entity.PolicyPurchase;
import org.springframework.stereotype.Component;

@Component
public class PolicyMapper {

    public PolicyResponse toPolicyResponse(InsurancePolicy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .policyNumber(policy.getPolicyNumber())
                .policyName(policy.getPolicyName())
                .policyType(policy.getPolicyType())
                .description(policy.getDescription())
                .coverageAmount(policy.getCoverageAmount())
                .basePremium(policy.getBasePremium())
                .duration(policy.getDuration())
                .status(policy.getStatus().name())
                .benefits(policy.getBenefits())
                .exclusions(policy.getExclusions())
                .createdAt(policy.getCreatedAt())
                .build();
    }

    public PurchaseResponse toPurchaseResponse(PolicyPurchase purchase, String policyName) {
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .purchaseNumber(purchase.getPurchaseNumber())
                .customerId(purchase.getCustomerId())
                .policyId(purchase.getPolicyId())
                .policyName(policyName)
                .quoteId(purchase.getQuoteId())
                .premium(purchase.getPremium())
                .startDate(purchase.getStartDate())
                .endDate(purchase.getEndDate())
                .status(purchase.getStatus().name())
                .createdAt(purchase.getCreatedAt())
                .build();
    }
}
