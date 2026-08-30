package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class ClaimStatusUpdatedEvent extends BaseEvent {
    private Long claimId;
    private String claimNumber;
    private Long customerId;
    private String customerEmail;
    private String previousStatus;
    private String newStatus;
    private String updatedBy;

    public static ClaimStatusUpdatedEvent create(Long claimId, String claimNumber, Long customerId,
                                                  String customerEmail, String previousStatus,
                                                  String newStatus, String updatedBy) {
        ClaimStatusUpdatedEvent event = new ClaimStatusUpdatedEvent();
        event.setClaimId(claimId);
        event.setClaimNumber(claimNumber);
        event.setCustomerId(customerId);
        event.setCustomerEmail(customerEmail);
        event.setPreviousStatus(previousStatus);
        event.setNewStatus(newStatus);
        event.setUpdatedBy(updatedBy);
        event.setEventType("CLAIM_STATUS_UPDATED");
        event.initDefaults();
        return event;
    }
}
