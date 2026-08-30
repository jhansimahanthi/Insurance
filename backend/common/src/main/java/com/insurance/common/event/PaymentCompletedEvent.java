package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@ToString(callSuper = true)
public class PaymentCompletedEvent extends BaseEvent {
    private Long paymentId;
    private String paymentReference;
    private Long customerId;
    private String customerEmail;
    private Long policyId;
    private Long purchaseId;
    private BigDecimal amount;
    private String paymentMethod;

    public static PaymentCompletedEvent create(Long paymentId, String paymentReference, Long customerId,
                                                String customerEmail, Long policyId, Long purchaseId,
                                                BigDecimal amount, String paymentMethod) {
        PaymentCompletedEvent event = new PaymentCompletedEvent();
        event.setPaymentId(paymentId);
        event.setPaymentReference(paymentReference);
        event.setCustomerId(customerId);
        event.setCustomerEmail(customerEmail);
        event.setPolicyId(policyId);
        event.setPurchaseId(purchaseId);
        event.setAmount(amount);
        event.setPaymentMethod(paymentMethod);
        event.setEventType("PAYMENT_COMPLETED");
        event.initDefaults();
        return event;
    }
}
