package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@ToString(callSuper = true)
public class PolicyPurchasedEvent extends BaseEvent {
    private Long purchaseId;
    private String purchaseNumber;
    private Long customerId;
    private String customerEmail;
    private Long policyId;
    private String policyName;
    private Long quoteId;
    private BigDecimal premium;
    private LocalDate startDate;
    private LocalDate endDate;

    public static PolicyPurchasedEvent create(Long purchaseId, String purchaseNumber, Long customerId,
                                               String customerEmail, Long policyId, String policyName,
                                               Long quoteId, BigDecimal premium,
                                               LocalDate startDate, LocalDate endDate) {
        PolicyPurchasedEvent event = new PolicyPurchasedEvent();
        event.setPurchaseId(purchaseId);
        event.setPurchaseNumber(purchaseNumber);
        event.setCustomerId(customerId);
        event.setCustomerEmail(customerEmail);
        event.setPolicyId(policyId);
        event.setPolicyName(policyName);
        event.setQuoteId(quoteId);
        event.setPremium(premium);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setEventType("POLICY_PURCHASED");
        event.initDefaults();
        return event;
    }
}
