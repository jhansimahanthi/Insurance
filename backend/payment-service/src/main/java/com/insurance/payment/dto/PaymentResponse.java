package com.insurance.payment.dto;

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
public class PaymentResponse {
    private Long id;
    private String paymentReference;
    private Long customerId;
    private Long policyId;
    private Long purchaseId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;
}
