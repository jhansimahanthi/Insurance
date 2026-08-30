package com.insurance.payment.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.common.event.PaymentCompletedEvent;
import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.payment.dto.PaymentRequest;
import com.insurance.payment.dto.PaymentResponse;
import com.insurance.payment.entity.Payment;
import com.insurance.payment.kafka.PaymentEventPublisher;
import com.insurance.payment.mapper.PaymentMapper;
import com.insurance.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private static final AtomicInteger PAYMENT_COUNTER = new AtomicInteger(1000);

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentEventPublisher eventPublisher;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              PaymentMapper paymentMapper,
                              PaymentEventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Processing payment for customer: {}, amount: {}", request.getCustomerId(), request.getAmount());

        String paymentReference = generatePaymentReference();

        // Simulated payment processing - in production this would connect to a payment gateway
        Payment payment = Payment.builder()
                .paymentReference(paymentReference)
                .customerId(request.getCustomerId())
                .policyId(request.getPolicyId())
                .purchaseId(request.getPurchaseId())
                .amount(request.getAmount())
                .paymentMethod(Payment.PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                .cardLastFour(request.getCardNumber().substring(request.getCardNumber().length() - 4))
                .status(Payment.PaymentStatus.COMPLETED)
                .transactionDate(LocalDateTime.now())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment processed successfully: {}", paymentReference);

        // Publish payment completed event
        PaymentCompletedEvent event = PaymentCompletedEvent.create(
                payment.getId(), payment.getPaymentReference(),
                payment.getCustomerId(), null,
                payment.getPolicyId(), payment.getPurchaseId(),
                payment.getAmount(), payment.getPaymentMethod().name());
        eventPublisher.publishPaymentCompletedEvent(event);

        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaginatedResponse<PaymentResponse> getPaymentsByCustomer(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> payments = paymentRepository.findByCustomerId(customerId, pageable);

        return PaginatedResponse.<PaymentResponse>builder()
                .content(payments.getContent().stream().map(paymentMapper::toResponse).toList())
                .page(payments.getNumber())
                .size(payments.getSize())
                .totalElements(payments.getTotalElements())
                .totalPages(payments.getTotalPages())
                .last(payments.isLast())
                .build();
    }

    @Override
    public PaginatedResponse<PaymentResponse> getAllPayments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> payments = paymentRepository.findAll(pageable);

        return PaginatedResponse.<PaymentResponse>builder()
                .content(payments.getContent().stream().map(paymentMapper::toResponse).toList())
                .page(payments.getNumber())
                .size(payments.getSize())
                .totalElements(payments.getTotalElements())
                .totalPages(payments.getTotalPages())
                .last(payments.isLast())
                .build();
    }

    private String generatePaymentReference() {
        return "PAY-" + String.format("%06d", PAYMENT_COUNTER.getAndIncrement());
    }
}
