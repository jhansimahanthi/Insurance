package com.insurance.payment.service;

import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.payment.dto.PaymentRequest;
import com.insurance.payment.dto.PaymentResponse;
import com.insurance.payment.entity.Payment;
import com.insurance.payment.kafka.PaymentEventPublisher;
import com.insurance.payment.mapper.PaymentMapper;
import com.insurance.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private PaymentMapper paymentMapper;
    @Mock private PaymentEventPublisher eventPublisher;

    @InjectMocks private PaymentServiceImpl paymentService;

    private Payment testPayment;
    private PaymentResponse testResponse;

    @BeforeEach
    void setUp() {
        testPayment = Payment.builder()
                .id(1L).paymentReference("PAY-000001").customerId(1L)
                .policyId(1L).purchaseId(1L)
                .amount(new BigDecimal("120.00"))
                .paymentMethod(Payment.PaymentMethod.CREDIT_CARD)
                .cardLastFour("3456")
                .status(Payment.PaymentStatus.COMPLETED)
                .transactionDate(LocalDateTime.now()).build();
        testResponse = PaymentResponse.builder()
                .id(1L).paymentReference("PAY-000001").customerId(1L)
                .policyId(1L).purchaseId(1L)
                .amount(new BigDecimal("120.00"))
                .paymentMethod("CREDIT_CARD")
                .status("COMPLETED").build();
    }

    @Test
    void processPayment_success() {
        PaymentRequest request = PaymentRequest.builder()
                .customerId(1L).policyId(1L).purchaseId(1L)
                .amount(new BigDecimal("120.00"))
                .paymentMethod("CREDIT_CARD")
                .cardNumber("4111111111113456")
                .cardHolderName("John Doe")
                .expiryDate("12/25").cvv("123").build();

        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(paymentMapper.toResponse(testPayment)).thenReturn(testResponse);

        PaymentResponse response = paymentService.processPayment(request);

        assertNotNull(response);
        assertEquals("PAY-000001", response.getPaymentReference());
        assertEquals("COMPLETED", response.getStatus());
        verify(eventPublisher).publishPaymentCompletedEvent(any());
    }

    @Test
    void getPaymentById_success() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentMapper.toResponse(testPayment)).thenReturn(testResponse);

        PaymentResponse response = paymentService.getPaymentById(1L);

        assertEquals("PAY-000001", response.getPaymentReference());
    }

    @Test
    void getPaymentById_notFound_throwsException() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> paymentService.getPaymentById(99L));
    }

    @Test
    void processPayment_simulatedPayment_alwaysCompletes() {
        PaymentRequest request = PaymentRequest.builder()
                .customerId(1L).policyId(1L).purchaseId(1L)
                .amount(new BigDecimal("500.00"))
                .paymentMethod("DEBIT_CARD")
                .cardNumber("5555555555554444")
                .cardHolderName("Jane Smith")
                .expiryDate("06/26").cvv("456").build();

        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            assertEquals(Payment.PaymentStatus.COMPLETED, p.getStatus());
            assertNotNull(p.getTransactionDate());
            assertEquals("4444", p.getCardLastFour());
            return testPayment;
        });
        when(paymentMapper.toResponse(any())).thenReturn(testResponse);

        PaymentResponse response = paymentService.processPayment(request);

        assertEquals("COMPLETED", response.getStatus());
    }
}
