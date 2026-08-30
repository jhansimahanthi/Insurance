package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@ToString(callSuper = true)
public class QuoteGeneratedEvent extends BaseEvent {
    private Long quoteId;
    private String quoteNumber;
    private Long customerId;
    private String customerEmail;
    private Long policyId;
    private String policyName;
    private BigDecimal calculatedPremium;
    private BigDecimal coverageAmount;

    public static QuoteGeneratedEvent create(Long quoteId, String quoteNumber, Long customerId,
                                              String customerEmail, Long policyId, String policyName,
                                              BigDecimal calculatedPremium, BigDecimal coverageAmount) {
        QuoteGeneratedEvent event = new QuoteGeneratedEvent();
        event.setQuoteId(quoteId);
        event.setQuoteNumber(quoteNumber);
        event.setCustomerId(customerId);
        event.setCustomerEmail(customerEmail);
        event.setPolicyId(policyId);
        event.setPolicyName(policyName);
        event.setCalculatedPremium(calculatedPremium);
        event.setCoverageAmount(coverageAmount);
        event.setEventType("QUOTE_GENERATED");
        event.initDefaults();
        return event;
    }
}
