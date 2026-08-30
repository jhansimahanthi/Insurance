package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@ToString(callSuper = true)
public class ClaimSubmittedEvent extends BaseEvent {
    private Long claimId;
    private String claimNumber;
    private Long customerId;
    private String customerEmail;
    private Long policyId;
    private String claimType;
    private BigDecimal claimAmount;
    private LocalDate incidentDate;
    private String status;

    public static ClaimSubmittedEvent create(Long claimId, String claimNumber, Long customerId,
                                              String customerEmail, Long policyId, String claimType,
                                              BigDecimal claimAmount, LocalDate incidentDate) {
        ClaimSubmittedEvent event = new ClaimSubmittedEvent();
        event.setClaimId(claimId);
        event.setClaimNumber(claimNumber);
        event.setCustomerId(customerId);
        event.setCustomerEmail(customerEmail);
        event.setPolicyId(policyId);
        event.setClaimType(claimType);
        event.setClaimAmount(claimAmount);
        event.setIncidentDate(incidentDate);
        event.setStatus("SUBMITTED");
        event.setEventType("CLAIM_SUBMITTED");
        event.initDefaults();
        return event;
    }
}
