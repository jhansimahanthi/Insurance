package com.insurance.payment.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.payment.dto.PaymentRequest;
import com.insurance.payment.dto.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPaymentById(Long id);
    PaginatedResponse<PaymentResponse> getPaymentsByCustomer(Long customerId, int page, int size);
    PaginatedResponse<PaymentResponse> getAllPayments(int page, int size);
}
