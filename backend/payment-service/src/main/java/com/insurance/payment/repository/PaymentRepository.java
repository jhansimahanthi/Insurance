package com.insurance.payment.repository;

import com.insurance.payment.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Page<Payment> findByCustomerId(Long customerId, Pageable pageable);
    Page<Payment> findByPurchaseId(Long purchaseId, Pageable pageable);
}
