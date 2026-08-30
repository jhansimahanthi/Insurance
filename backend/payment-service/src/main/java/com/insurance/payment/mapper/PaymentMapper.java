package com.insurance.payment.mapper;

import com.insurance.payment.dto.PaymentResponse;
import com.insurance.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentReference(payment.getPaymentReference())
                .customerId(payment.getCustomerId())
                .policyId(payment.getPolicyId())
                .purchaseId(payment.getPurchaseId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .status(payment.getStatus().name())
                .transactionDate(payment.getTransactionDate())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
